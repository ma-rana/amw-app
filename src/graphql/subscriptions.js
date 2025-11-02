/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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
export const onCreateStoryUsersLink = /* GraphQL */ `
  subscription OnCreateStoryUsersLink(
    $filter: ModelSubscriptionStoryUsersLinkFilterInput
  ) {
    onCreateStoryUsersLink(filter: $filter) {
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
export const onUpdateStoryUsersLink = /* GraphQL */ `
  subscription OnUpdateStoryUsersLink(
    $filter: ModelSubscriptionStoryUsersLinkFilterInput
  ) {
    onUpdateStoryUsersLink(filter: $filter) {
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
export const onDeleteStoryUsersLink = /* GraphQL */ `
  subscription OnDeleteStoryUsersLink(
    $filter: ModelSubscriptionStoryUsersLinkFilterInput
  ) {
    onDeleteStoryUsersLink(filter: $filter) {
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
export const onCreateStory = /* GraphQL */ `
  subscription OnCreateStory($filter: ModelSubscriptionStoryFilterInput) {
    onCreateStory(filter: $filter) {
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
export const onUpdateStory = /* GraphQL */ `
  subscription OnUpdateStory($filter: ModelSubscriptionStoryFilterInput) {
    onUpdateStory(filter: $filter) {
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
export const onDeleteStory = /* GraphQL */ `
  subscription OnDeleteStory($filter: ModelSubscriptionStoryFilterInput) {
    onDeleteStory(filter: $filter) {
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
export const onCreateStoryUsers = /* GraphQL */ `
  subscription OnCreateStoryUsers(
    $filter: ModelSubscriptionStoryUsersFilterInput
  ) {
    onCreateStoryUsers(filter: $filter) {
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
export const onUpdateStoryUsers = /* GraphQL */ `
  subscription OnUpdateStoryUsers(
    $filter: ModelSubscriptionStoryUsersFilterInput
  ) {
    onUpdateStoryUsers(filter: $filter) {
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
export const onDeleteStoryUsers = /* GraphQL */ `
  subscription OnDeleteStoryUsers(
    $filter: ModelSubscriptionStoryUsersFilterInput
  ) {
    onDeleteStoryUsers(filter: $filter) {
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
export const onCreateStoryOwners = /* GraphQL */ `
  subscription OnCreateStoryOwners(
    $filter: ModelSubscriptionStoryOwnersFilterInput
  ) {
    onCreateStoryOwners(filter: $filter) {
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
export const onUpdateStoryOwners = /* GraphQL */ `
  subscription OnUpdateStoryOwners(
    $filter: ModelSubscriptionStoryOwnersFilterInput
  ) {
    onUpdateStoryOwners(filter: $filter) {
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
export const onDeleteStoryOwners = /* GraphQL */ `
  subscription OnDeleteStoryOwners(
    $filter: ModelSubscriptionStoryOwnersFilterInput
  ) {
    onDeleteStoryOwners(filter: $filter) {
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
export const onCreateMedia = /* GraphQL */ `
  subscription OnCreateMedia($filter: ModelSubscriptionMediaFilterInput) {
    onCreateMedia(filter: $filter) {
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
export const onUpdateMedia = /* GraphQL */ `
  subscription OnUpdateMedia($filter: ModelSubscriptionMediaFilterInput) {
    onUpdateMedia(filter: $filter) {
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
export const onDeleteMedia = /* GraphQL */ `
  subscription OnDeleteMedia($filter: ModelSubscriptionMediaFilterInput) {
    onDeleteMedia(filter: $filter) {
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
export const onCreateNotification = /* GraphQL */ `
  subscription OnCreateNotification(
    $filter: ModelSubscriptionNotificationFilterInput
  ) {
    onCreateNotification(filter: $filter) {
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
export const onUpdateNotification = /* GraphQL */ `
  subscription OnUpdateNotification(
    $filter: ModelSubscriptionNotificationFilterInput
  ) {
    onUpdateNotification(filter: $filter) {
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
export const onDeleteNotification = /* GraphQL */ `
  subscription OnDeleteNotification(
    $filter: ModelSubscriptionNotificationFilterInput
  ) {
    onDeleteNotification(filter: $filter) {
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
export const onCreateAttachment = /* GraphQL */ `
  subscription OnCreateAttachment(
    $filter: ModelSubscriptionAttachmentFilterInput
  ) {
    onCreateAttachment(filter: $filter) {
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
export const onUpdateAttachment = /* GraphQL */ `
  subscription OnUpdateAttachment(
    $filter: ModelSubscriptionAttachmentFilterInput
  ) {
    onUpdateAttachment(filter: $filter) {
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
export const onDeleteAttachment = /* GraphQL */ `
  subscription OnDeleteAttachment(
    $filter: ModelSubscriptionAttachmentFilterInput
  ) {
    onDeleteAttachment(filter: $filter) {
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
export const onCreateAnswer = /* GraphQL */ `
  subscription OnCreateAnswer($filter: ModelSubscriptionAnswerFilterInput) {
    onCreateAnswer(filter: $filter) {
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
export const onUpdateAnswer = /* GraphQL */ `
  subscription OnUpdateAnswer($filter: ModelSubscriptionAnswerFilterInput) {
    onUpdateAnswer(filter: $filter) {
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
export const onDeleteAnswer = /* GraphQL */ `
  subscription OnDeleteAnswer($filter: ModelSubscriptionAnswerFilterInput) {
    onDeleteAnswer(filter: $filter) {
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
export const onCreateQuestion = /* GraphQL */ `
  subscription OnCreateQuestion($filter: ModelSubscriptionQuestionFilterInput) {
    onCreateQuestion(filter: $filter) {
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
export const onUpdateQuestion = /* GraphQL */ `
  subscription OnUpdateQuestion($filter: ModelSubscriptionQuestionFilterInput) {
    onUpdateQuestion(filter: $filter) {
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
export const onDeleteQuestion = /* GraphQL */ `
  subscription OnDeleteQuestion($filter: ModelSubscriptionQuestionFilterInput) {
    onDeleteQuestion(filter: $filter) {
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
export const onCreateMoment = /* GraphQL */ `
  subscription OnCreateMoment($filter: ModelSubscriptionMomentFilterInput) {
    onCreateMoment(filter: $filter) {
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
export const onUpdateMoment = /* GraphQL */ `
  subscription OnUpdateMoment($filter: ModelSubscriptionMomentFilterInput) {
    onUpdateMoment(filter: $filter) {
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
export const onDeleteMoment = /* GraphQL */ `
  subscription OnDeleteMoment($filter: ModelSubscriptionMomentFilterInput) {
    onDeleteMoment(filter: $filter) {
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
export const onCreateChapter = /* GraphQL */ `
  subscription OnCreateChapter($filter: ModelSubscriptionChapterFilterInput) {
    onCreateChapter(filter: $filter) {
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
export const onUpdateChapter = /* GraphQL */ `
  subscription OnUpdateChapter($filter: ModelSubscriptionChapterFilterInput) {
    onUpdateChapter(filter: $filter) {
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
export const onDeleteChapter = /* GraphQL */ `
  subscription OnDeleteChapter($filter: ModelSubscriptionChapterFilterInput) {
    onDeleteChapter(filter: $filter) {
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
export const onCreateSharedUrl = /* GraphQL */ `
  subscription OnCreateSharedUrl(
    $filter: ModelSubscriptionSharedUrlFilterInput
  ) {
    onCreateSharedUrl(filter: $filter) {
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
export const onUpdateSharedUrl = /* GraphQL */ `
  subscription OnUpdateSharedUrl(
    $filter: ModelSubscriptionSharedUrlFilterInput
  ) {
    onUpdateSharedUrl(filter: $filter) {
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
export const onDeleteSharedUrl = /* GraphQL */ `
  subscription OnDeleteSharedUrl(
    $filter: ModelSubscriptionSharedUrlFilterInput
  ) {
    onDeleteSharedUrl(filter: $filter) {
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
export const onCreateRelationship = /* GraphQL */ `
  subscription OnCreateRelationship(
    $filter: ModelSubscriptionRelationshipFilterInput
  ) {
    onCreateRelationship(filter: $filter) {
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
export const onUpdateRelationship = /* GraphQL */ `
  subscription OnUpdateRelationship(
    $filter: ModelSubscriptionRelationshipFilterInput
  ) {
    onUpdateRelationship(filter: $filter) {
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
export const onDeleteRelationship = /* GraphQL */ `
  subscription OnDeleteRelationship(
    $filter: ModelSubscriptionRelationshipFilterInput
  ) {
    onDeleteRelationship(filter: $filter) {
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
export const onCreateEmergency = /* GraphQL */ `
  subscription OnCreateEmergency(
    $filter: ModelSubscriptionEmergencyFilterInput
  ) {
    onCreateEmergency(filter: $filter) {
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
export const onUpdateEmergency = /* GraphQL */ `
  subscription OnUpdateEmergency(
    $filter: ModelSubscriptionEmergencyFilterInput
  ) {
    onUpdateEmergency(filter: $filter) {
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
export const onDeleteEmergency = /* GraphQL */ `
  subscription OnDeleteEmergency(
    $filter: ModelSubscriptionEmergencyFilterInput
  ) {
    onDeleteEmergency(filter: $filter) {
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
export const onCreateReport = /* GraphQL */ `
  subscription OnCreateReport($filter: ModelSubscriptionReportFilterInput) {
    onCreateReport(filter: $filter) {
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
export const onUpdateReport = /* GraphQL */ `
  subscription OnUpdateReport($filter: ModelSubscriptionReportFilterInput) {
    onUpdateReport(filter: $filter) {
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
export const onDeleteReport = /* GraphQL */ `
  subscription OnDeleteReport($filter: ModelSubscriptionReportFilterInput) {
    onDeleteReport(filter: $filter) {
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
export const onCreateStorageStatistics = /* GraphQL */ `
  subscription OnCreateStorageStatistics(
    $filter: ModelSubscriptionStorageStatisticsFilterInput
  ) {
    onCreateStorageStatistics(filter: $filter) {
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
export const onUpdateStorageStatistics = /* GraphQL */ `
  subscription OnUpdateStorageStatistics(
    $filter: ModelSubscriptionStorageStatisticsFilterInput
  ) {
    onUpdateStorageStatistics(filter: $filter) {
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
export const onDeleteStorageStatistics = /* GraphQL */ `
  subscription OnDeleteStorageStatistics(
    $filter: ModelSubscriptionStorageStatisticsFilterInput
  ) {
    onDeleteStorageStatistics(filter: $filter) {
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
export const onCreateMomentTaggedUsers = /* GraphQL */ `
  subscription OnCreateMomentTaggedUsers(
    $filter: ModelSubscriptionMomentTaggedUsersFilterInput
  ) {
    onCreateMomentTaggedUsers(filter: $filter) {
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
export const onUpdateMomentTaggedUsers = /* GraphQL */ `
  subscription OnUpdateMomentTaggedUsers(
    $filter: ModelSubscriptionMomentTaggedUsersFilterInput
  ) {
    onUpdateMomentTaggedUsers(filter: $filter) {
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
export const onDeleteMomentTaggedUsers = /* GraphQL */ `
  subscription OnDeleteMomentTaggedUsers(
    $filter: ModelSubscriptionMomentTaggedUsersFilterInput
  ) {
    onDeleteMomentTaggedUsers(filter: $filter) {
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
