export const host = process.env.NEXT_PUBLIC_BACKENDAPI;

const withId = (baseUrl: string) => (id: string) => `${baseUrl}/${id}`;
const withMidId = (baseUrl: string, end: string) => (
  id: string | string[] | undefined
) => `${baseUrl}/${id}/${end}`;

export const users = {
  follow: `${host}/users/follow`,
  addFriend: `${host}/users/add-friend`,
};

export const common = {
  topics: `${host}/common/topics`,
};

// export const pages = {
//   create: `${host}/pages/create-page`,
// };

export const groups = {
  allGroups: `${host}/api/v1/groups`,
  singleGroup: withId(`${host}/api/v1/groups`),
  joinGroup: withMidId(`${host}/api/v1/groups`, `members/join`),
  leaveGroup: withMidId(`${host}/api/v1/groups`, `members/leave`),
  notes: withMidId(`${host}/api/v1/groups`, `note`),
  events: withMidId(`${host}/api/v1/groups`, `events`),
  editGroup: withId(`${host}/api/v1/groups`),
  deleteGroup: withId(`${host}/api/v1/groups`),
  groupEvent: {
    create: withMidId(`${host}/api/v1/groups`, `events/create-event`),
    getAll: withMidId(`${host}/api/v1/groups`, `events`),
  },
};
export const pages = {
  allPages: `${host}/api/v1/pages`,
  singlePage: withId(`${host}/api/v1/pages`),
  follow: withMidId(`${host}/api/v1/pages`, `toggle-follow`),
};

export const events = {
  create: `${host}/events/create-event`,
};

export const posts = {
  likedPosts: `${host}/posts/liked-posts`,
};

export const suggestions = {
  followees: `${host}/suggestions/followees`,
  friends: `${host}/suggestions/friends`,
  groups: `${host}/suggestions/groups`,
  pages: `${host}/api/v1/pages`,
};
