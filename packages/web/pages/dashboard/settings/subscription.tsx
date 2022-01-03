import { useRouter } from 'next/router'
import { withApollo } from '@/lib/apollo'

const OldSubscriptionPage = () => {
  const router = useRouter()
  if (typeof window !== 'undefined') {
    router.push({
      pathname: `/my-feed`,
    })
  }
  return null
}

export default withApollo(OldSubscriptionPage)
