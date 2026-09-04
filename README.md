# NZ Bird Sound Database, web client

**Live at [nzbirddatabase.com](https://nzbirddatabase.com)**

The React client. Browse 138 New Zealand bird species, play their calls, upload a recording to have
a model identify it, or describe a bird in plain words and get ranked matches.

Part of a four-repository project:

| Repository | What it holds |
|---|---|
| [NZBirdSoundDatabase-AWS](https://github.com/giddypergrid/NZBirdSoundDatabase-AWS) | The deployed backend, ECS Fargate, and the test suites. **Start here.** |
| [NZBirdSoundDatabase-Backend](https://github.com/giddypergrid/NZBirdSoundDatabase-Backend) | The Django REST application and the machine learning pipeline |
| [NZBirdSoundDatabase-Prep](https://github.com/giddypergrid/NZBirdSoundDatabase-Prep) | Data preparation and model training |
| this one | The client |

## Two ways to find a bird

```
  by name              "kea"            ──►  text match on the species list
  by description       "screeches       ──►  SentenceTransformer embeds the phrase,
                        at night"            cosine similarity ranks all 138 descriptions
  by sound             upload .wav      ──►  BirdNET + LightGBM return an eBird code
```

The description search is the one worth trying. Nobody remembers a species name, but most people can
describe what they heard.

## Notes on the client

Every species carries a one-line character description as well as a formal one, "a suited-up
hooligan singing opera before picking a fight" for the Australian magpie. Those exist because a grid
of 138 scientific names is unreadable, and a person scanning for the bird in their garden needs
something they can match against a memory.

Heavy endpoints can answer `503` on purpose when the backend is shedding load, so classification and
description search both handle that as a normal state and ask the user to retry, rather than
surfacing an error.

---

React, TypeScript, Create React App. Talks to `api.nzbirddatabase.com`.
