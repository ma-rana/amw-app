/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      lastName
      funFacts
      bio
      sharingMoments
      imageUrl
      stories {
        nextToken
        __typename
      }
      ownershipStories {
        nextToken
        __typename
      }
      sharedUrls {
        nextToken
        __typename
      }
      relations {
        nextToken
        __typename
      }
      emergency {
        id
        firstName
        lastName
        contact
        email
        createdAt
        updatedAt
        emergencyUserId
        __typename
      }
      taggedMoments {
        nextToken
        __typename
      }
      userDevices {
        channelType
        deviceToken
        __typename
      }
      isAccountProtected
      createdAt
      updatedAt
      userEmergencyId
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        lastName
        funFacts
        bio
        sharingMoments
        imageUrl
        isAccountProtected
        createdAt
        updatedAt
        userEmergencyId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getStoryUsersLink = /* GraphQL */ `
  query GetStoryUsersLink($id: ID!) {
    getStoryUsersLink(id: $id) {
      id
      userId
      storyId
      role
      user {
        id
        name
        lastName
        funFacts
        bio
        sharingMoments
        imageUrl
        isAccountProtected
        createdAt
        updatedAt
        userEmergencyId
        __typename
      }
      story {
        id
        title
        inviteCode
        inviteCodeForOwner
        imageUrl
        userId
        userIds
        locked
        createdAt
        updatedAt
        storyUserId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listStoryUsersLinks = /* GraphQL */ `
  query ListStoryUsersLinks(
    $filter: ModelStoryUsersLinkFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStoryUsersLinks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        storyId
        role
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getStory = /* GraphQL */ `
  query GetStory($id: ID!) {
    getStory(id: $id) {
      id
      title
      inviteCode
      inviteCodeForOwner
      imageUrl
      userId
      userIds
      users {
        nextToken
        __typename
      }
      owners {
        nextToken
        __typename
      }
      chapters {
        nextToken
        __typename
      }
      user {
        id
        name
        lastName
        funFacts
        bio
        sharingMoments
        imageUrl
        isAccountProtected
        createdAt
        updatedAt
        userEmergencyId
        __typename
      }
      sharedUrl {
        nextToken
        __typename
      }
      locked
      createdAt
      updatedAt
      storyUserId
      __typename
    }
  }
`;
export const listStories = /* GraphQL */ `
  query ListStories(
    $filter: ModelStoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStories(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        inviteCode
        inviteCodeForOwner
        imageUrl
        userId
        userIds
        locked
        createdAt
        updatedAt
        storyUserId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getStoryUsers = /* GraphQL */ `
  query GetStoryUsers($id: ID!) {
    getStoryUsers(id: $id) {
      id
      userId
      storyId
      user {
        id
        name
        lastName
        funFacts
        bio
        sharingMoments
        imageUrl
        isAccountProtected
        createdAt
        updatedAt
        userEmergencyId
        __typename
      }
      story {
        id
        title
        inviteCode
        inviteCodeForOwner
        imageUrl
        userId
        userIds
        locked
        createdAt
        updatedAt
        storyUserId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listStoryUsers = /* GraphQL */ `
  query ListStoryUsers(
    $filter: ModelStoryUsersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStoryUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        storyId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getStoryOwners = /* GraphQL */ `
  query GetStoryOwners($id: ID!) {
    getStoryOwners(id: $id) {
      id
      userId
      storyId
      user {
        id
        name
        lastName
        funFacts
        bio
        sharingMoments
        imageUrl
        isAccountProtected
        createdAt
        updatedAt
        userEmergencyId
        __typename
      }
      story {
        id
        title
        inviteCode
        inviteCodeForOwner
        imageUrl
        userId
        userIds
        locked
        createdAt
        updatedAt
        storyUserId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listStoryOwners = /* GraphQL */ `
  query ListStoryOwners(
    $filter: ModelStoryOwnersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStoryOwners(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        storyId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const storyByInviteCode = /* GraphQL */ `
  query StoryByInviteCode(
    $inviteCode: String!
    $sortDirection: ModelSortDirection
    $filter: ModelStoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    storyByInviteCode(
      inviteCode: $inviteCode
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        inviteCode
        inviteCodeForOwner
        imageUrl
        userId
        userIds
        locked
        createdAt
        updatedAt
        storyUserId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const storyByInviteCodeForOwner = /* GraphQL */ `
  query StoryByInviteCodeForOwner(
    $inviteCodeForOwner: String!
    $sortDirection: ModelSortDirection
    $filter: ModelStoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    storyByInviteCodeForOwner(
      inviteCodeForOwner: $inviteCodeForOwner
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        inviteCode
        inviteCodeForOwner
        imageUrl
        userId
        userIds
        locked
        createdAt
        updatedAt
        storyUserId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const storyByUserId = /* GraphQL */ `
  query StoryByUserId(
    $userId: String!
    $sortDirection: ModelSortDirection
    $filter: ModelStoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    storyByUserId(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        inviteCode
        inviteCodeForOwner
        imageUrl
        userId
        userIds
        locked
        createdAt
        updatedAt
        storyUserId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const storyUsersByUserId = /* GraphQL */ `
  query StoryUsersByUserId(
    $userId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelStoryUsersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    storyUsersByUserId(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        storyId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const storyUsersByStoryId = /* GraphQL */ `
  query StoryUsersByStoryId(
    $storyId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelStoryUsersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    storyUsersByStoryId(
      storyId: $storyId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        storyId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const storyOwnersByUserId = /* GraphQL */ `
  query StoryOwnersByUserId(
    $userId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelStoryOwnersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    storyOwnersByUserId(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        storyId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const storyOwnersByStoryId = /* GraphQL */ `
  query StoryOwnersByStoryId(
    $storyId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelStoryOwnersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    storyOwnersByStoryId(
      storyId: $storyId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        storyId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getMedia = /* GraphQL */ `
  query GetMedia($id: ID!) {
    getMedia(id: $id) {
      id
      parentId
      timestamp
      imageUrl
      videoUrl
      mediaSizeMegaBytes
      isVideo
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listMedia = /* GraphQL */ `
  query ListMedia(
    $filter: ModelMediaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMedia(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        parentId
        timestamp
        imageUrl
        videoUrl
        mediaSizeMegaBytes
        isVideo
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getNotification = /* GraphQL */ `
  query GetNotification($id: ID!) {
    getNotification(id: $id) {
      timestamp
      message
      title
      storyId
      StoryName
      inviteCode
      storyImageUrl
      isRead
      isStoryJoined
      redirectUrl
      momentId
      fromUser {
        id
        name
        lastName
        funFacts
        bio
        sharingMoments
        imageUrl
        isAccountProtected
        createdAt
        updatedAt
        userEmergencyId
        __typename
      }
      toUser {
        id
        name
        lastName
        funFacts
        bio
        sharingMoments
        imageUrl
        isAccountProtected
        createdAt
        updatedAt
        userEmergencyId
        __typename
      }
      id
      createdAt
      updatedAt
      notificationFromUserId
      notificationToUserId
      __typename
    }
  }
`;
export const listNotifications = /* GraphQL */ `
  query ListNotifications(
    $filter: ModelNotificationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotifications(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        timestamp
        message
        title
        storyId
        StoryName
        inviteCode
        storyImageUrl
        isRead
        isStoryJoined
        redirectUrl
        momentId
        id
        createdAt
        updatedAt
        notificationFromUserId
        notificationToUserId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getAttachment = /* GraphQL */ `
  query GetAttachment($id: ID!) {
    getAttachment(id: $id) {
      id
      parentId
      userId
      user {
        id
        name
        lastName
        funFacts
        bio
        sharingMoments
        imageUrl
        isAccountProtected
        createdAt
        updatedAt
        userEmergencyId
        __typename
      }
      timestamp
      elementId
      element {
        id
        parentId
        timestamp
        imageUrl
        videoUrl
        mediaSizeMegaBytes
        isVideo
        createdAt
        updatedAt
        __typename
      }
      type
      awswerId
      createdAt
      updatedAt
      attachmentUserId
      __typename
    }
  }
`;
export const listAttachments = /* GraphQL */ `
  query ListAttachments(
    $filter: ModelAttachmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAttachments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        parentId
        userId
        timestamp
        elementId
        type
        awswerId
        createdAt
        updatedAt
        attachmentUserId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const attachmentsByAwswerId = /* GraphQL */ `
  query AttachmentsByAwswerId(
    $awswerId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelAttachmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    attachmentsByAwswerId(
      awswerId: $awswerId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        parentId
        userId
        timestamp
        elementId
        type
        awswerId
        createdAt
        updatedAt
        attachmentUserId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getAnswer = /* GraphQL */ `
  query GetAnswer($id: ID!) {
    getAnswer(id: $id) {
      id
      userId
      user {
        id
        name
        lastName
        funFacts
        bio
        sharingMoments
        imageUrl
        isAccountProtected
        createdAt
        updatedAt
        userEmergencyId
        __typename
      }
      questionId
      text
      attachments {
        nextToken
        __typename
      }
      attachmentIds
      createdAt
      updatedAt
      answerUserId
      __typename
    }
  }
`;
export const listAnswers = /* GraphQL */ `
  query ListAnswers(
    $filter: ModelAnswerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAnswers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        questionId
        text
        attachmentIds
        createdAt
        updatedAt
        answerUserId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getQuestion = /* GraphQL */ `
  query GetQuestion($id: ID!) {
    getQuestion(id: $id) {
      id
      userId
      title
      timestamp
      toUserId
      answer {
        id
        userId
        questionId
        text
        attachmentIds
        createdAt
        updatedAt
        answerUserId
        __typename
      }
      answerId
      attachments {
        id
        parentId
        userId
        timestamp
        elementId
        type
        awswerId
        createdAt
        updatedAt
        attachmentUserId
        __typename
      }
      attachmentIds
      chapterId
      toUser {
        id
        name
        lastName
        funFacts
        bio
        sharingMoments
        imageUrl
        isAccountProtected
        createdAt
        updatedAt
        userEmergencyId
        __typename
      }
      storyId {
        id
        title
        inviteCode
        inviteCodeForOwner
        imageUrl
        userId
        userIds
        locked
        createdAt
        updatedAt
        storyUserId
        __typename
      }
      createdAt
      updatedAt
      questionToUserId
      questionStoryIdId
      __typename
    }
  }
`;
export const listQuestions = /* GraphQL */ `
  query ListQuestions(
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        title
        timestamp
        toUserId
        answerId
        attachmentIds
        chapterId
        createdAt
        updatedAt
        questionToUserId
        questionStoryIdId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const questionsByChapterId = /* GraphQL */ `
  query QuestionsByChapterId(
    $chapterId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    questionsByChapterId(
      chapterId: $chapterId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        title
        timestamp
        toUserId
        answerId
        attachmentIds
        chapterId
        createdAt
        updatedAt
        questionToUserId
        questionStoryIdId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getMoment = /* GraphQL */ `
  query GetMoment($id: ID!) {
    getMoment(id: $id) {
      id
      title
      order
      mediaId
      description
      userId
      taggedUserIds
      taggedUsers {
        nextToken
        __typename
      }
      timestamp
      storyId
      chapterId
      user {
        id
        name
        lastName
        funFacts
        bio
        sharingMoments
        imageUrl
        isAccountProtected
        createdAt
        updatedAt
        userEmergencyId
        __typename
      }
      media {
        id
        parentId
        timestamp
        imageUrl
        videoUrl
        mediaSizeMegaBytes
        isVideo
        createdAt
        updatedAt
        __typename
      }
      chapter {
        id
        title
        order
        imageUrl
        isDefault
        storyId
        userId
        momentIds
        questionIds
        createdAt
        updatedAt
        chapterUserId
        __typename
      }
      story {
        id
        title
        inviteCode
        inviteCodeForOwner
        imageUrl
        userId
        userIds
        locked
        createdAt
        updatedAt
        storyUserId
        __typename
      }
      reportedCount
      createdAt
      updatedAt
      momentUserId
      momentMediaId
      momentStoryId
      __typename
    }
  }
`;
export const listMoments = /* GraphQL */ `
  query ListMoments(
    $filter: ModelMomentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMoments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        order
        mediaId
        description
        userId
        taggedUserIds
        timestamp
        storyId
        chapterId
        reportedCount
        createdAt
        updatedAt
        momentUserId
        momentMediaId
        momentStoryId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const momentByOrder = /* GraphQL */ `
  query MomentByOrder(
    $order: Int!
    $sortDirection: ModelSortDirection
    $filter: ModelMomentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    momentByOrder(
      order: $order
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        order
        mediaId
        description
        userId
        taggedUserIds
        timestamp
        storyId
        chapterId
        reportedCount
        createdAt
        updatedAt
        momentUserId
        momentMediaId
        momentStoryId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const momentsByStoryId = /* GraphQL */ `
  query MomentsByStoryId(
    $storyId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMomentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    momentsByStoryId(
      storyId: $storyId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        order
        mediaId
        description
        userId
        taggedUserIds
        timestamp
        storyId
        chapterId
        reportedCount
        createdAt
        updatedAt
        momentUserId
        momentMediaId
        momentStoryId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const momentsByChapterId = /* GraphQL */ `
  query MomentsByChapterId(
    $chapterId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMomentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    momentsByChapterId(
      chapterId: $chapterId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        order
        mediaId
        description
        userId
        taggedUserIds
        timestamp
        storyId
        chapterId
        reportedCount
        createdAt
        updatedAt
        momentUserId
        momentMediaId
        momentStoryId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getChapter = /* GraphQL */ `
  query GetChapter($id: ID!) {
    getChapter(id: $id) {
      id
      title
      order
      imageUrl
      isDefault
      storyId
      userId
      momentIds
      questionIds
      user {
        id
        name
        lastName
        funFacts
        bio
        sharingMoments
        imageUrl
        isAccountProtected
        createdAt
        updatedAt
        userEmergencyId
        __typename
      }
      questions {
        nextToken
        __typename
      }
      moments {
        nextToken
        __typename
      }
      sharedUrl {
        nextToken
        __typename
      }
      story {
        id
        title
        inviteCode
        inviteCodeForOwner
        imageUrl
        userId
        userIds
        locked
        createdAt
        updatedAt
        storyUserId
        __typename
      }
      createdAt
      updatedAt
      chapterUserId
      __typename
    }
  }
`;
export const listChapters = /* GraphQL */ `
  query ListChapters(
    $filter: ModelChapterFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChapters(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        order
        imageUrl
        isDefault
        storyId
        userId
        momentIds
        questionIds
        createdAt
        updatedAt
        chapterUserId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const chapterByOrder = /* GraphQL */ `
  query ChapterByOrder(
    $order: Int!
    $sortDirection: ModelSortDirection
    $filter: ModelChapterFilterInput
    $limit: Int
    $nextToken: String
  ) {
    chapterByOrder(
      order: $order
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        order
        imageUrl
        isDefault
        storyId
        userId
        momentIds
        questionIds
        createdAt
        updatedAt
        chapterUserId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const chaptersByStoryId = /* GraphQL */ `
  query ChaptersByStoryId(
    $storyId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelChapterFilterInput
    $limit: Int
    $nextToken: String
  ) {
    chaptersByStoryId(
      storyId: $storyId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        order
        imageUrl
        isDefault
        storyId
        userId
        momentIds
        questionIds
        createdAt
        updatedAt
        chapterUserId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getSharedUrl = /* GraphQL */ `
  query GetSharedUrl($id: ID!) {
    getSharedUrl(id: $id) {
      id
      url
      isReady
      chapterId
      storyId
      chapter {
        id
        title
        order
        imageUrl
        isDefault
        storyId
        userId
        momentIds
        questionIds
        createdAt
        updatedAt
        chapterUserId
        __typename
      }
      story {
        id
        title
        inviteCode
        inviteCodeForOwner
        imageUrl
        userId
        userIds
        locked
        createdAt
        updatedAt
        storyUserId
        __typename
      }
      timestamp
      user {
        id
        name
        lastName
        funFacts
        bio
        sharingMoments
        imageUrl
        isAccountProtected
        createdAt
        updatedAt
        userEmergencyId
        __typename
      }
      createdAt
      updatedAt
      userSharedUrlsId
      __typename
    }
  }
`;
export const listSharedUrls = /* GraphQL */ `
  query ListSharedUrls(
    $filter: ModelSharedUrlFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listSharedUrls(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        url
        isReady
        chapterId
        storyId
        timestamp
        createdAt
        updatedAt
        userSharedUrlsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const sharedUrlsByChapterIdAndTimestamp = /* GraphQL */ `
  query SharedUrlsByChapterIdAndTimestamp(
    $chapterId: ID!
    $timestamp: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSharedUrlFilterInput
    $limit: Int
    $nextToken: String
  ) {
    sharedUrlsByChapterIdAndTimestamp(
      chapterId: $chapterId
      timestamp: $timestamp
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        url
        isReady
        chapterId
        storyId
        timestamp
        createdAt
        updatedAt
        userSharedUrlsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const sharedUrlsByStoryIdAndTimestamp = /* GraphQL */ `
  query SharedUrlsByStoryIdAndTimestamp(
    $storyId: ID!
    $timestamp: ModelIntKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelSharedUrlFilterInput
    $limit: Int
    $nextToken: String
  ) {
    sharedUrlsByStoryIdAndTimestamp(
      storyId: $storyId
      timestamp: $timestamp
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        url
        isReady
        chapterId
        storyId
        timestamp
        createdAt
        updatedAt
        userSharedUrlsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getRelationship = /* GraphQL */ `
  query GetRelationship($id: ID!) {
    getRelationship(id: $id) {
      id
      relation
      withUser
      user {
        id
        name
        lastName
        funFacts
        bio
        sharingMoments
        imageUrl
        isAccountProtected
        createdAt
        updatedAt
        userEmergencyId
        __typename
      }
      createdAt
      updatedAt
      userRelationsId
      __typename
    }
  }
`;
export const listRelationships = /* GraphQL */ `
  query ListRelationships(
    $filter: ModelRelationshipFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRelationships(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        relation
        withUser
        createdAt
        updatedAt
        userRelationsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getEmergency = /* GraphQL */ `
  query GetEmergency($id: ID!) {
    getEmergency(id: $id) {
      id
      firstName
      lastName
      contact
      email
      user {
        id
        name
        lastName
        funFacts
        bio
        sharingMoments
        imageUrl
        isAccountProtected
        createdAt
        updatedAt
        userEmergencyId
        __typename
      }
      createdAt
      updatedAt
      emergencyUserId
      __typename
    }
  }
`;
export const listEmergencies = /* GraphQL */ `
  query ListEmergencies(
    $filter: ModelEmergencyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEmergencies(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        firstName
        lastName
        contact
        email
        createdAt
        updatedAt
        emergencyUserId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getReport = /* GraphQL */ `
  query GetReport($id: ID!) {
    getReport(id: $id) {
      id
      name
      userID
      email
      reason
      reportedContent
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listReports = /* GraphQL */ `
  query ListReports(
    $filter: ModelReportFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReports(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        userID
        email
        reason
        reportedContent
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getStorageStatistics = /* GraphQL */ `
  query GetStorageStatistics($id: ID!) {
    getStorageStatistics(id: $id) {
      id
      timestamp
      fileSize
      s3Key
      user {
        id
        name
        lastName
        funFacts
        bio
        sharingMoments
        imageUrl
        isAccountProtected
        createdAt
        updatedAt
        userEmergencyId
        __typename
      }
      createdAt
      updatedAt
      storageStatisticsUserId
      __typename
    }
  }
`;
export const listStorageStatistics = /* GraphQL */ `
  query ListStorageStatistics(
    $filter: ModelStorageStatisticsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStorageStatistics(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        timestamp
        fileSize
        s3Key
        createdAt
        updatedAt
        storageStatisticsUserId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getMomentTaggedUsers = /* GraphQL */ `
  query GetMomentTaggedUsers($id: ID!) {
    getMomentTaggedUsers(id: $id) {
      id
      momentId
      userId
      moment {
        id
        title
        order
        mediaId
        description
        userId
        taggedUserIds
        timestamp
        storyId
        chapterId
        reportedCount
        createdAt
        updatedAt
        momentUserId
        momentMediaId
        momentStoryId
        __typename
      }
      user {
        id
        name
        lastName
        funFacts
        bio
        sharingMoments
        imageUrl
        isAccountProtected
        createdAt
        updatedAt
        userEmergencyId
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listMomentTaggedUsers = /* GraphQL */ `
  query ListMomentTaggedUsers(
    $filter: ModelMomentTaggedUsersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMomentTaggedUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        momentId
        userId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const momentTaggedUsersByMomentId = /* GraphQL */ `
  query MomentTaggedUsersByMomentId(
    $momentId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMomentTaggedUsersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    momentTaggedUsersByMomentId(
      momentId: $momentId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        momentId
        userId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const momentTaggedUsersByUserId = /* GraphQL */ `
  query MomentTaggedUsersByUserId(
    $userId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMomentTaggedUsersFilterInput
    $limit: Int
    $nextToken: String
  ) {
    momentTaggedUsersByUserId(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        momentId
        userId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
