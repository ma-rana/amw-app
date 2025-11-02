// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const PushNotificationService = {
  "APNS": "APNS",
  "GCM": "GCM"
};

const { Media, Notification, Attachment, Answer, Question, Moment, Chapter, User, StoryUsersLink, Story, SharedUrl, Relationship, Emergency, Report, StorageStatistics, MomentTaggedUsers, StoryUsers, StoryOwners, NotificationUser, Devices, UserDevices } = initSchema(schema);

export {
  Media,
  Notification,
  Attachment,
  Answer,
  Question,
  Moment,
  Chapter,
  User,
  StoryUsersLink,
  Story,
  SharedUrl,
  Relationship,
  Emergency,
  Report,
  StorageStatistics,
  MomentTaggedUsers,
  StoryUsers,
  StoryOwners,
  PushNotificationService,
  NotificationUser,
  Devices,
  UserDevices
};