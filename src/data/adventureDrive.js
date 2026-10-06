const adventureDrive = {
  chapter: {
    number: 5,
    title: 'ESCAPING THE BEDROOM',
  },

  songs: [
    {
      id: 'still-into-you',

      title: 'STILL INTO YOU',
      artist: 'PARAMORE',

      // Temporary prototype timing.
      // We'll sync this properly when we have actual audio.
      beatInterval: 430,
      beatWindow: 150,

      scenery: 'city',

      dialogue: [
        {
          type: 'dialogue',
          lines: [
            {
              speaker: 'NAT',
              text: 'Aww yeah time for playlist!!',
            },
            {
              speaker: 'JEN',
              text: 'Hahah put it on.',
            },
          ],
        },

        {
          type: 'pause',
          duration: 2500,
        },

        {
          type: 'dialogue',
          lines: [
            {
              speaker: 'NAT',
              text: '*humming*',
            },
            {
              speaker: 'JEN',
              text: '*humming*',
            },
          ],
        },

        {
          type: 'pause',
          duration: 3000,
        },

        {
          type: 'dialogue',
          lines: [
            {
              speaker: 'JEN',
              text: "I can't believe you thought sending me the link to this song was a good way to let me know you still fuck with me lol",
            },
            {
              speaker: 'NAT',
              text: 'Did it work?',
            },
            {
              speaker: 'JEN',
              text: '....',
            },
          ],
        },

        {
          type: 'thought',
          text: "Better than I would've liked.",
        },

        {
          type: 'dialogue',
          lines: [
            {
              speaker: 'NAT',
              text: "That's what I thought bruh!! Get fucked!",
            },
            {
              speaker: 'JEN',
              text: "... later, not when I'm driving",
            },
            {
              speaker: 'NAT',
              text: 'Aww why not baby?',
            },
            {
              speaker: 'NAT',
              text: 'You can be a good boy and focus, can’t you?',
            },
          ],
        },

        {
          type: 'thought',
          text: 'Breathe goddamit',
        },

        {
          type: 'dialogue',
          lines: [
            {
              speaker: 'JEN',
              text: 'I will purposefully crash this car!',
            },
            {
              speaker: 'NAT',
              text: 'Hahaha',
            },
          ],
        },
      ],
    },

    {
       id: 'take-me-or-leave-me',

        title: 'TAKE ME OR LEAVE ME',
        artist: 'RENT',

        beatInterval: 390,
        beatWindow: 150,

        scenery: 'food-run',

      dialogue: [
        {
          type: 'dialogue',
          lines: [
            {
              speaker: 'JEN',
              text: 'Do we know where we are going?',
            },
            {
              speaker: 'NAT',
              text: "Doesn't matter!! Our song is on!!",
            },
            {
              speaker: 'NAT',
              text: 'We gotta practice for karaoke when we stunt on all those bitches.',
            },
            {
              speaker: 'JEN',
              text: "Hahahah, well start singing you're missing your part!",
            },
            {
              speaker: 'NAT',
              text: 'Aww fuck',
            },
          ],
        },

        {
          type: 'pause',
          duration: 3000,
        },

        {
          type: 'dialogue',
          lines: [
            {
              speaker: 'JEN',
              text: 'What are you doing?',
            },
            {
              speaker: 'NAT',
              text: 'Rewinding, we messed that bit up again!',
            },
            {
              speaker: 'NAT',
              text: 'We are gonna get it one of these days!',
            },
          ],
        },

        {
          type: 'song-end',
        },

        {
          type: 'dialogue',
          lines: [
            {
              speaker: 'NAT',
              text: 'God we are good.',
            },
          ],
        },

        {
          type: 'thought',
          text: 'Yeah I think so too.',
        },
      ],
    },

    {
       id: 'for-good',

        title: 'FOR GOOD',
        artist: 'WICKED',

        beatInterval: 520,
        beatWindow: 170,

        scenery: 'coast',

      dialogue: [
        {
          type: 'dialogue',
          lines: [
            {
              speaker: 'NAT',
              text: 'Sing it baby!!',
            },
            {
              speaker: 'JEN',
              text: 'Hahah, *sings harder*',
            },
            {
              speaker: 'NAT',
              text: 'We are so gonna make everybody cry at our party!',
            },
            {
              speaker: 'NAT',
              text: 'God its gonna be good!',
            },
            {
              speaker: 'NAT',
              text: 'We need to start planning that.',
            },
            {
              speaker: 'JEN',
              text: "You've been saying that forever lol",
            },
            {
              speaker: 'NAT',
              text: "Watch it I'm gonna lock in and get it done!",
            },
            {
              speaker: 'JEN',
              text: 'Sure thing baby.',
            },
            {
              speaker: 'NAT',
              text: 'Where are we going again?',
            },
          ],
        },

        {
          type: 'thought',
          text: "Doesn't really matter",
        },

        {
          type: 'fade-out',
        },
      ],
    },
  ],
};

export default adventureDrive;