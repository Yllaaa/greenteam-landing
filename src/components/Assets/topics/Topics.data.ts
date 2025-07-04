// Topics.data.ts
type ItemType = {
  id: number;
  name: string;
  parentId?: string;
  subtopics?: ItemType[];
};

export const Topics: ItemType[] = [
  {
    id: 5,
    name: "art",
    subtopics: [
      {
        id: 29,
        name: "craft",
      },
      {
        id: 30,
        name: "music",
      },
      {
        id: 31,
        name: "show",
      },
      {
        id: 37,
        name: "dance",
      },
      {
        id: 38,
        name: "literature",
      },
      {
        id: 39,
        name: "cinema",
      },
    ],
  },
  {
    id: 1,
    name: "food",
    subtopics: [
      {
        id: 10,
        name: "natural",
      },
      {
        id: 11,
        name: "nutrition",
      },
      {
        id: 12,
        name: "hygiene",
      },
      {
        id: 7,
        name: "growing",
      },
      {
        id: 8,
        name: "cooking",
      },
      {
        id: 9,
        name: "preserving",
      },
    ],
  },
  {
    id: 2,
    name: "knowledge", // You might need to add this key to your translations
    subtopics: [
      {
        id: 14,
        name: "astronomy",
      },
      {
        id: 15,
        name: "biology",
      },
      {
        id: 16,
        name: "geography", // Note: Your translation has "geography" not "geology"
      },
      {
        id: 20,
        name: "others",
      },
      {
        id: 13,
        name: "philosiphy", // Note: matches your translation key (with typo)
      },
      {
        id: 17,
        name: "history",
      },
    ],
  },
  {
    id: 3,
    name: "physical",
    subtopics: [
      {
        id: 18,
        name: "games",
      },
      {
        id: 19,
        name: "warmUp",
      },
      {
        id: 21,
        name: "sports",
      },
      {
        id: 22,
        name: "active",
      },
      {
        id: 23,
        name: "passive",
      },
      {
        id: 36,
        name: "aerobics",
      },
    ],
  },
  {
    id: 6,
    name: "eco",
    subtopics: [
      {
        id: 33,
        name: "water",
      },
      {
        id: 40,
        name: "sustainable",
      },
      {
        id: 41,
        name: "energy",
      },
      {
        id: 42,
        name: "waste",
      },
      {
        id: 32,
        name: "bioconstruction",
      },
      {
        id: 34,
        name: "durable",
      },
    ],
  },
  {
    id: 4,
    name: "community",
    subtopics: [
      {
        id: 24,
        name: "together",
      },
      {
        id: 25,
        name: "nature",
      },
      {
        id: 26,
        name: "volunteering",
      },
      {
        id: 27,
        name: "ecotourism",
      },
      {
        id: 28,
        name: "warning",
      },
      {
        id: 35,
        name: "cooperatives",
      },
    ],
  },
];