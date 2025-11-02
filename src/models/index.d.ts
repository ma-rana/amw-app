import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncItem, AsyncCollection } from "@aws-amplify/datastore";

export enum PushNotificationService {
  APNS = "APNS",
  GCM = "GCM"
}

type EagerNotificationUser = {
  readonly userId?: string | null;
  readonly name?: string | null;
  readonly lastName?: string | null;
  readonly imageUrl?: string | null;
  readonly userDevices?: (Devices | null)[] | null;
}

type LazyNotificationUser = {
  readonly userId?: string | null;
  readonly name?: string | null;
  readonly lastName?: string | null;
  readonly imageUrl?: string | null;
  readonly userDevices?: (Devices | null)[] | null;
}

export declare type NotificationUser = LazyLoading extends LazyLoadingDisabled ? EagerNotificationUser : LazyNotificationUser

export declare const NotificationUser: (new (init: ModelInit<NotificationUser>) => NotificationUser)

type EagerDevices = {
  readonly deviceToken?: string | null;
  readonly channelType?: string | null;
  readonly __typename?: string | null;
}

type LazyDevices = {
  readonly deviceToken?: string | null;
  readonly channelType?: string | null;
  readonly __typename?: string | null;
}

export declare type Devices = LazyLoading extends LazyLoadingDisabled ? EagerDevices : LazyDevices

export declare const Devices: (new (init: ModelInit<Devices>) => Devices)

type EagerUserDevices = {
  readonly channelType?: string | null;
  readonly deviceToken?: string | null;
}

type LazyUserDevices = {
  readonly channelType?: string | null;
  readonly deviceToken?: string | null;
}

export declare type UserDevices = LazyLoading extends LazyLoadingDisabled ? EagerUserDevices : LazyUserDevices

export declare const UserDevices: (new (init: ModelInit<UserDevices>) => UserDevices)

type EagerMedia = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Media, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly parentId?: string | null;
  readonly timestamp?: number | null;
  readonly imageUrl?: string | null;
  readonly videoUrl?: string | null;
  readonly mediaSizeMegaBytes?: number | null;
  readonly isVideo?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMedia = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Media, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly parentId?: string | null;
  readonly timestamp?: number | null;
  readonly imageUrl?: string | null;
  readonly videoUrl?: string | null;
  readonly mediaSizeMegaBytes?: number | null;
  readonly isVideo?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Media = LazyLoading extends LazyLoadingDisabled ? EagerMedia : LazyMedia

export declare const Media: (new (init: ModelInit<Media>) => Media) & {
  copyOf(source: Media, mutator: (draft: MutableModel<Media>) => MutableModel<Media> | void): Media;
}

type EagerNotification = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Notification, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly timestamp?: number | null;
  readonly message?: string | null;
  readonly title?: string | null;
  readonly storyId?: string | null;
  readonly StoryName?: string | null;
  readonly inviteCode?: string | null;
  readonly storyImageUrl?: string | null;
  readonly isRead?: boolean | null;
  readonly isStoryJoined?: boolean | null;
  readonly redirectUrl?: string | null;
  readonly momentId?: string | null;
  readonly fromUser?: User | null;
  readonly toUser?: User | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly notificationFromUserId?: string | null;
  readonly notificationToUserId?: string | null;
}

type LazyNotification = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Notification, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly timestamp?: number | null;
  readonly message?: string | null;
  readonly title?: string | null;
  readonly storyId?: string | null;
  readonly StoryName?: string | null;
  readonly inviteCode?: string | null;
  readonly storyImageUrl?: string | null;
  readonly isRead?: boolean | null;
  readonly isStoryJoined?: boolean | null;
  readonly redirectUrl?: string | null;
  readonly momentId?: string | null;
  readonly fromUser: AsyncItem<User | undefined>;
  readonly toUser: AsyncItem<User | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly notificationFromUserId?: string | null;
  readonly notificationToUserId?: string | null;
}

export declare type Notification = LazyLoading extends LazyLoadingDisabled ? EagerNotification : LazyNotification

export declare const Notification: (new (init: ModelInit<Notification>) => Notification) & {
  copyOf(source: Notification, mutator: (draft: MutableModel<Notification>) => MutableModel<Notification> | void): Notification;
}

type EagerAttachment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Attachment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly parentId?: string | null;
  readonly userId?: string | null;
  readonly user?: User | null;
  readonly timestamp?: number | null;
  readonly elementId?: string | null;
  readonly type?: string | null;
  readonly awswerId: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly attachmentUserId?: string | null;
}

type LazyAttachment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Attachment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly parentId?: string | null;
  readonly userId?: string | null;
  readonly user: AsyncItem<User | undefined>;
  readonly timestamp?: number | null;
  readonly elementId?: string | null;
  readonly type?: string | null;
  readonly awswerId: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly attachmentUserId?: string | null;
}

export declare type Attachment = LazyLoading extends LazyLoadingDisabled ? EagerAttachment : LazyAttachment

export declare const Attachment: (new (init: ModelInit<Attachment>) => Attachment) & {
  copyOf(source: Attachment, mutator: (draft: MutableModel<Attachment>) => MutableModel<Attachment> | void): Attachment;
}

type EagerAnswer = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Answer, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId?: string | null;
  readonly user?: User | null;
  readonly questionId?: string | null;
  readonly text?: string | null;
  readonly attachments?: (Attachment | null)[] | null;
  readonly attachmentIds?: (string | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly answerUserId?: string | null;
}

type LazyAnswer = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Answer, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId?: string | null;
  readonly user: AsyncItem<User | undefined>;
  readonly questionId?: string | null;
  readonly text?: string | null;
  readonly attachments: AsyncCollection<Attachment>;
  readonly attachmentIds?: (string | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly answerUserId?: string | null;
}

export declare type Answer = LazyLoading extends LazyLoadingDisabled ? EagerAnswer : LazyAnswer

export declare const Answer: (new (init: ModelInit<Answer>) => Answer) & {
  copyOf(source: Answer, mutator: (draft: MutableModel<Answer>) => MutableModel<Answer> | void): Answer;
}

type EagerQuestion = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Question, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId?: string | null;
  readonly title?: string | null;
  readonly timestamp?: number | null;
  readonly toUserId?: string | null;
  readonly answerId?: string | null;
  readonly attachmentIds?: (string | null)[] | null;
  readonly chapterId: string;
  readonly toUser?: User | null;
  readonly storyId?: Story | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly questionToUserId?: string | null;
  readonly questionStoryIdId?: string | null;
}

type LazyQuestion = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Question, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId?: string | null;
  readonly title?: string | null;
  readonly timestamp?: number | null;
  readonly toUserId?: string | null;
  readonly answerId?: string | null;
  readonly attachmentIds?: (string | null)[] | null;
  readonly chapterId: string;
  readonly toUser: AsyncItem<User | undefined>;
  readonly storyId: AsyncItem<Story | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly questionToUserId?: string | null;
  readonly questionStoryIdId?: string | null;
}

export declare type Question = LazyLoading extends LazyLoadingDisabled ? EagerQuestion : LazyQuestion

export declare const Question: (new (init: ModelInit<Question>) => Question) & {
  copyOf(source: Question, mutator: (draft: MutableModel<Question>) => MutableModel<Question> | void): Question;
}

type EagerMoment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Moment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title?: string | null;
  readonly order?: number | null;
  readonly mediaId?: string | null;
  readonly description?: string | null;
  readonly userId?: string | null;
  readonly taggedUserIds?: (string | null)[] | null;
  readonly taggedUsers?: (MomentTaggedUsers | null)[] | null;
  readonly timestamp?: number | null;
  readonly storyId?: string | null;
  readonly chapterId?: string | null;
  readonly user?: User | null;
  readonly media?: Media | null;
  readonly chapter?: Chapter | null;
  readonly story?: Story | null;
  readonly reportedCount?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly momentUserId?: string | null;
  readonly momentMediaId?: string | null;
  readonly momentStoryId?: string | null;
}

type LazyMoment = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Moment, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title?: string | null;
  readonly order?: number | null;
  readonly mediaId?: string | null;
  readonly description?: string | null;
  readonly userId?: string | null;
  readonly taggedUserIds?: (string | null)[] | null;
  readonly taggedUsers: AsyncCollection<MomentTaggedUsers>;
  readonly timestamp?: number | null;
  readonly storyId?: string | null;
  readonly chapterId?: string | null;
  readonly user: AsyncItem<User | undefined>;
  readonly media: AsyncItem<Media | undefined>;
  readonly chapter: AsyncItem<Chapter | undefined>;
  readonly story: AsyncItem<Story | undefined>;
  readonly reportedCount?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly momentUserId?: string | null;
  readonly momentMediaId?: string | null;
  readonly momentStoryId?: string | null;
}

export declare type Moment = LazyLoading extends LazyLoadingDisabled ? EagerMoment : LazyMoment

export declare const Moment: (new (init: ModelInit<Moment>) => Moment) & {
  copyOf(source: Moment, mutator: (draft: MutableModel<Moment>) => MutableModel<Moment> | void): Moment;
}

type EagerChapter = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Chapter, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title?: string | null;
  readonly order?: number | null;
  readonly imageUrl?: string | null;
  readonly isDefault?: boolean | null;
  readonly storyId: string;
  readonly userId?: string | null;
  readonly momentIds?: (string | null)[] | null;
  readonly questionIds?: (string | null)[] | null;
  readonly user?: User | null;
  readonly questions?: (Question | null)[] | null;
  readonly moments?: (Moment | null)[] | null;
  readonly sharedUrl?: (SharedUrl | null)[] | null;
  readonly story?: Story | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly chapterUserId?: string | null;
}

type LazyChapter = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Chapter, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title?: string | null;
  readonly order?: number | null;
  readonly imageUrl?: string | null;
  readonly isDefault?: boolean | null;
  readonly storyId: string;
  readonly userId?: string | null;
  readonly momentIds?: (string | null)[] | null;
  readonly questionIds?: (string | null)[] | null;
  readonly user: AsyncItem<User | undefined>;
  readonly questions: AsyncCollection<Question>;
  readonly moments: AsyncCollection<Moment>;
  readonly sharedUrl: AsyncCollection<SharedUrl>;
  readonly story: AsyncItem<Story | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly chapterUserId?: string | null;
}

export declare type Chapter = LazyLoading extends LazyLoadingDisabled ? EagerChapter : LazyChapter

export declare const Chapter: (new (init: ModelInit<Chapter>) => Chapter) & {
  copyOf(source: Chapter, mutator: (draft: MutableModel<Chapter>) => MutableModel<Chapter> | void): Chapter;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly lastName?: string | null;
  readonly funFacts?: string | null;
  readonly bio?: string | null;
  readonly sharingMoments?: string | null;
  readonly imageUrl?: string | null;
  readonly stories?: (StoryUsers | null)[] | null;
  readonly ownershipStories?: (StoryOwners | null)[] | null;
  readonly sharedUrls?: (SharedUrl | null)[] | null;
  readonly relations?: (Relationship | null)[] | null;
  readonly emergency?: Emergency | null;
  readonly taggedMoments?: (MomentTaggedUsers | null)[] | null;
  readonly userDevices?: (UserDevices | null)[] | null;
  readonly isAccountProtected?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userEmergencyId?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly lastName?: string | null;
  readonly funFacts?: string | null;
  readonly bio?: string | null;
  readonly sharingMoments?: string | null;
  readonly imageUrl?: string | null;
  readonly stories: AsyncCollection<StoryUsers>;
  readonly ownershipStories: AsyncCollection<StoryOwners>;
  readonly sharedUrls: AsyncCollection<SharedUrl>;
  readonly relations: AsyncCollection<Relationship>;
  readonly emergency: AsyncItem<Emergency | undefined>;
  readonly taggedMoments: AsyncCollection<MomentTaggedUsers>;
  readonly userDevices?: (UserDevices | null)[] | null;
  readonly isAccountProtected?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userEmergencyId?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerStoryUsersLink = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<StoryUsersLink, 'id'>;
  };
  readonly id: string;
  readonly userId: string;
  readonly storyId: string;
  readonly role?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

type LazyStoryUsersLink = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<StoryUsersLink, 'id'>;
  };
  readonly id: string;
  readonly userId: string;
  readonly storyId: string;
  readonly role?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export declare type StoryUsersLink = LazyLoading extends LazyLoadingDisabled ? EagerStoryUsersLink : LazyStoryUsersLink

export declare const StoryUsersLink: (new (init: ModelInit<StoryUsersLink>) => StoryUsersLink) & {
  copyOf(source: StoryUsersLink, mutator: (draft: MutableModel<StoryUsersLink>) => MutableModel<StoryUsersLink> | void): StoryUsersLink;
}

type EagerStory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Story, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title: string;
  readonly inviteCode: string;
  readonly inviteCodeForOwner?: string | null;
  readonly imageUrl?: string | null;
  readonly userId?: string | null;
  readonly userIds?: (string | null)[] | null;
  readonly users?: (StoryUsers | null)[] | null;
  readonly owners?: (StoryOwners | null)[] | null;
  readonly chapters?: (Chapter | null)[] | null;
  readonly user?: User | null;
  readonly sharedUrl?: (SharedUrl | null)[] | null;
  readonly locked?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly storyUserId?: string | null;
}

type LazyStory = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Story, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly title: string;
  readonly inviteCode: string;
  readonly inviteCodeForOwner?: string | null;
  readonly imageUrl?: string | null;
  readonly userId?: string | null;
  readonly userIds?: (string | null)[] | null;
  readonly users: AsyncCollection<StoryUsers>;
  readonly owners: AsyncCollection<StoryOwners>;
  readonly chapters: AsyncCollection<Chapter>;
  readonly user: AsyncItem<User | undefined>;
  readonly sharedUrl: AsyncCollection<SharedUrl>;
  readonly locked?: boolean | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly storyUserId?: string | null;
}

export declare type Story = LazyLoading extends LazyLoadingDisabled ? EagerStory : LazyStory

export declare const Story: (new (init: ModelInit<Story>) => Story) & {
  copyOf(source: Story, mutator: (draft: MutableModel<Story>) => MutableModel<Story> | void): Story;
}

type EagerSharedUrl = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<SharedUrl, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly url?: string | null;
  readonly isReady?: boolean | null;
  readonly chapterId?: string | null;
  readonly storyId?: string | null;
  readonly chapter?: Chapter | null;
  readonly story?: Story | null;
  readonly timestamp?: number | null;
  readonly user?: User | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userSharedUrlsId?: string | null;
}

type LazySharedUrl = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<SharedUrl, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly url?: string | null;
  readonly isReady?: boolean | null;
  readonly chapterId?: string | null;
  readonly storyId?: string | null;
  readonly chapter: AsyncItem<Chapter | undefined>;
  readonly story: AsyncItem<Story | undefined>;
  readonly timestamp?: number | null;
  readonly user: AsyncItem<User | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userSharedUrlsId?: string | null;
}

export declare type SharedUrl = LazyLoading extends LazyLoadingDisabled ? EagerSharedUrl : LazySharedUrl

export declare const SharedUrl: (new (init: ModelInit<SharedUrl>) => SharedUrl) & {
  copyOf(source: SharedUrl, mutator: (draft: MutableModel<SharedUrl>) => MutableModel<SharedUrl> | void): SharedUrl;
}

type EagerRelationship = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Relationship, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly relation?: string | null;
  readonly withUser: string;
  readonly user?: User | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userRelationsId?: string | null;
}

type LazyRelationship = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Relationship, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly relation?: string | null;
  readonly withUser: string;
  readonly user: AsyncItem<User | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userRelationsId?: string | null;
}

export declare type Relationship = LazyLoading extends LazyLoadingDisabled ? EagerRelationship : LazyRelationship

export declare const Relationship: (new (init: ModelInit<Relationship>) => Relationship) & {
  copyOf(source: Relationship, mutator: (draft: MutableModel<Relationship>) => MutableModel<Relationship> | void): Relationship;
}

type EagerEmergency = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Emergency, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly contact?: string | null;
  readonly email?: string | null;
  readonly user?: User | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly emergencyUserId?: string | null;
}

type LazyEmergency = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Emergency, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly firstName?: string | null;
  readonly lastName?: string | null;
  readonly contact?: string | null;
  readonly email?: string | null;
  readonly user: AsyncItem<User | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly emergencyUserId?: string | null;
}

export declare type Emergency = LazyLoading extends LazyLoadingDisabled ? EagerEmergency : LazyEmergency

export declare const Emergency: (new (init: ModelInit<Emergency>) => Emergency) & {
  copyOf(source: Emergency, mutator: (draft: MutableModel<Emergency>) => MutableModel<Emergency> | void): Emergency;
}

type EagerReport = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Report, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly userID: string;
  readonly email: string;
  readonly reason: string;
  readonly reportedContent: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyReport = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Report, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly userID: string;
  readonly email: string;
  readonly reason: string;
  readonly reportedContent: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Report = LazyLoading extends LazyLoadingDisabled ? EagerReport : LazyReport

export declare const Report: (new (init: ModelInit<Report>) => Report) & {
  copyOf(source: Report, mutator: (draft: MutableModel<Report>) => MutableModel<Report> | void): Report;
}

type EagerStorageStatistics = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<StorageStatistics, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly timestamp?: number | null;
  readonly fileSize?: string | null;
  readonly s3Key?: string | null;
  readonly user?: User | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly storageStatisticsUserId?: string | null;
}

type LazyStorageStatistics = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<StorageStatistics, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly timestamp?: number | null;
  readonly fileSize?: string | null;
  readonly s3Key?: string | null;
  readonly user: AsyncItem<User | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly storageStatisticsUserId?: string | null;
}

export declare type StorageStatistics = LazyLoading extends LazyLoadingDisabled ? EagerStorageStatistics : LazyStorageStatistics

export declare const StorageStatistics: (new (init: ModelInit<StorageStatistics>) => StorageStatistics) & {
  copyOf(source: StorageStatistics, mutator: (draft: MutableModel<StorageStatistics>) => MutableModel<StorageStatistics> | void): StorageStatistics;
}

type EagerMomentTaggedUsers = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MomentTaggedUsers, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly momentId?: string | null;
  readonly userId?: string | null;
  readonly moment: Moment;
  readonly user: User;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyMomentTaggedUsers = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MomentTaggedUsers, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly momentId?: string | null;
  readonly userId?: string | null;
  readonly moment: AsyncItem<Moment>;
  readonly user: AsyncItem<User>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type MomentTaggedUsers = LazyLoading extends LazyLoadingDisabled ? EagerMomentTaggedUsers : LazyMomentTaggedUsers

export declare const MomentTaggedUsers: (new (init: ModelInit<MomentTaggedUsers>) => MomentTaggedUsers) & {
  copyOf(source: MomentTaggedUsers, mutator: (draft: MutableModel<MomentTaggedUsers>) => MutableModel<MomentTaggedUsers> | void): MomentTaggedUsers;
}

type EagerStoryUsers = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<StoryUsers, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId?: string | null;
  readonly storyId?: string | null;
  readonly user: User;
  readonly story: Story;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyStoryUsers = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<StoryUsers, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId?: string | null;
  readonly storyId?: string | null;
  readonly user: AsyncItem<User>;
  readonly story: AsyncItem<Story>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type StoryUsers = LazyLoading extends LazyLoadingDisabled ? EagerStoryUsers : LazyStoryUsers

export declare const StoryUsers: (new (init: ModelInit<StoryUsers>) => StoryUsers) & {
  copyOf(source: StoryUsers, mutator: (draft: MutableModel<StoryUsers>) => MutableModel<StoryUsers> | void): StoryUsers;
}

type EagerStoryOwners = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<StoryOwners, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId?: string | null;
  readonly storyId?: string | null;
  readonly user: User;
  readonly story: Story;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyStoryOwners = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<StoryOwners, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId?: string | null;
  readonly storyId?: string | null;
  readonly user: AsyncItem<User>;
  readonly story: AsyncItem<Story>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type StoryOwners = LazyLoading extends LazyLoadingDisabled ? EagerStoryOwners : LazyStoryOwners

export declare const StoryOwners: (new (init: ModelInit<StoryOwners>) => StoryOwners) & {
  copyOf(source: StoryOwners, mutator: (draft: MutableModel<StoryOwners>) => MutableModel<StoryOwners> | void): StoryOwners;
}