export const host = 'http://localhost:9000/api/v1/';

export const users = {
    follow: `${host}/users/follow`,
    addFriend: `${host}/users/add-friend`
}

export const common = {
    topics: `${host}/common/topics`
}

export const pages = {
    create: `${host}/pages/create-page`
}

export const groups = {
    create: `${host}/groups`
}

export const events = {
    create: `${host}/events/create-event`
}

export const posts = {
    likedPosts: `${host}/posts/liked-posts`
}

export const suggestions = {
    followees: `${host}/suggestions/followees`,
    friends: `${host}/suggestions/friends`,
    groups: `${host}/suggestions/groups`,
    pages: `${host}/suggestions/pages`
}