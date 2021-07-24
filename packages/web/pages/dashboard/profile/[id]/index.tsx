import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import { withApollo } from '@/lib/apollo'
import LoadingWrapper from '@/components/LoadingWrapper'
import DashboardLayout from '@/components/Layouts/DashboardLayout'
import { useProfilePageQuery } from '@/generated/graphql'
import Profile from '@/components/Dashboard/Profile'

interface InitialProps {
  namespacesRequired: string[]
}

const ProfilePage: NextPage<InitialProps> = () => {
  const idStr = useRouter().query.id as string
  const userId = parseInt(idStr, 10)

  const { data, loading, error, fetchMore, updateQuery } = useProfilePageQuery({ variables: { userId, limit: 5 } })

  React.useState(data)

  const { userById, infinatePosts: posts, currentUser } = data || {}

  async function fetchMorePosts() {
    const fetchedMore = await fetchMore({
        variables: {
          cursor: posts ? posts[posts.length - 1].id : null
        }
      })

      updateQuery((previousResult) => {
        console.log(previousResult)
      return {
        ...previousResult,
        // @ts-ignore 
        infinatePosts: [...previousResult.infinatePosts, ...fetchedMore.data.infinatePosts]
      }})
  
  }

  return (
    <LoadingWrapper loading={loading} error={error}>
      <DashboardLayout pad="never">
        {userById && posts && (
          <Profile isLoggedInUser={currentUser?.id === userId} user={userById} posts={posts} fetchMore={fetchMorePosts} />
        )}
      </DashboardLayout>
    </LoadingWrapper>
  )
}

ProfilePage.getInitialProps = async () => ({
  namespacesRequired: ['common', 'profile', 'post'],
})

export default withApollo(ProfilePage)
