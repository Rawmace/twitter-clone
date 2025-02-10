export const POSTS = [
  {
    _id: "1",
    text: "Watching this great anime !! A goosebumped moment 🚀",
    img: "/posts/post1.png",
    user: {
      username: "sujanrai",
      profileImg: "/avatars/boy1.png",
      fullName: "Sujan Rai",
    },
    comments: [
      {
        _id: "1",
        text: "Which anime?",
        user: {
          username: "anitashrestha",
          profileImg: "/avatars/girl1.png",
          fullName: "Anita Shrestha",
        },
      },
    ],
    likes: ["6658s891", "6658s892", "6658s893", "6658s894"],
  },
  {
    _id: "2",
    text: "Just finished a 10k run! Feeling amazing. 🏃‍♂️",
    user: {
      username: "bibekthapa",
      profileImg: "/avatars/boy2.png",
      fullName: "Bibek Thapa",
    },
    comments: [
      {
        _id: "1",
        text: "Keep it up, dai!",
        user: {
          username: "saraswotipoudel",
          profileImg: "/avatars/girl2.png",
          fullName: "Saraswoti Poudel",
        },
      },
    ],
    likes: ["6658s891", "6658s892", "6658s893", "6658s894"],
  },
  {
    _id: "3",
    text: "Check out this stunning skull I created using 'Leonardo.Ai'",
    img: "/posts/post2.png",
    user: {
      username: "rajeshgurung",
      profileImg: "/avatars/boy3.png",
      fullName: "Rajesh Gurung",
    },
    comments: [],
    likes: [
      "6658s891",
      "6658s892",
      "6658s893",
      "6658s894",
      "6658s895",
      "6658s896",
    ],
  },
  {
    _id: "4",
    text: "Diving into Rust programming. Any Rustaceans here? 🦀",
    img: "/posts/post3.png",
    user: {
      username: "prakashsharma",
      profileImg: "/avatars/boy3.png",
      fullName: "Prakash Sharma",
    },
    comments: [
      {
        _id: "1",
        text: "Rust is awesome!",
        user: {
          username: "niranakarki",
          profileImg: "/avatars/girl3.png",
          fullName: "Nirana Karki",
        },
      },
    ],
    likes: [
      "6658s891",
      "6658s892",
      "6658s893",
      "6658s894",
      "6658s895",
      "6658s896",
      "6658s897",
      "6658s898",
      "6658s899",
    ],
  },
];

export const USERS_FOR_RIGHT_PANEL = [
  {
    _id: "1",
    fullName: "Sujan Rai",
    username: "sujanrai",
    profileImg: "/avatars/boy2.png",
  },
  {
    _id: "2",
    fullName: "Anita Shrestha",
    username: "anitashrestha",
    profileImg: "/avatars/girl1.png",
  },
  {
    _id: "3",
    fullName: "Bibek Thapa",
    username: "bibekthapa",
    profileImg: "/avatars/boy3.png",
  },
  {
    _id: "4",
    fullName: "Saraswoti Poudel",
    username: "saraswotipoudel",
    profileImg: "/avatars/girl2.png",
  },
];
