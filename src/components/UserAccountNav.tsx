import { getUserSubscriptionPlan } from "@/lib/stripe"
import { UserAccountNavClient } from "./UserAccountNavClient"

interface Props {
  email?: string
  name: string
  imageUrl?: string
}

const UserAccountNav = async ({ email, name, imageUrl }: Props) => {
  const subscriptionPlan = await getUserSubscriptionPlan()

  return (
    <UserAccountNavClient
      email={email}
      name={name}
      imageUrl={imageUrl}
      subscriptionPlan={subscriptionPlan}
    />
  )
}

export default UserAccountNav
