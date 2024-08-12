# Zwisch
Making carpools convenient and eco-friendly for campuses!

## Impact
Most high-schools and college campuses lack a culture for carpooling, yet student transportation contributes to the 16% of carbon emissions that come from cars [(EPA)](https://www.epa.gov/ghgemissions/overview-greenhouse-gases).

## Why?
Carpooling is simply not convenient. Most ridesharers aren't comfortable sharing a ride with strangers. Existing solutions are too time-consuming to setup, riddled with complicated forms and menus.

## Solution
Zwisch organizes carpools within school communities, where trust and safety are key. Students can request a ride with a simple sentence. 

## The Power of Gemini
Simply type a sentence or two about your ride details. Gemini analyzes your text and matches you with a rider/driver if possible.

## Backend
The Gemini 1.5 Pro API converts natural language inputs and creates JSON ride objects. Whenever a new request or offer is created, Gemini processes all unfulfilled requests and offers at once, then matches them based on compatibility of route similarity, timing, and your preferences. A ride is created on Firebase Firestore, and notifications are sent to both users.

### About the Creators
Zwisch was started by two friends, [Alessio Toniolo](https://www.linkedin.com/in/at6) and [Vedic Patel](https://www.linkedin.com/in/vedic-patel-539546238/), who were tired of campus traffic congestion and a lack of easy-to-use apps. Alessio (18) is a senior at Marist School and Vedic Patel (18) is a senior at South Forsyth High School. Their home of Atlanta is notorious for an overflow of cars on the road and a lack of accessible public transportation. The carpooling solution, Zwisch, was designed to scale for schools, colleges, and even workplaces to mitigate bad traffic and mitigate the climate crisis.

## Check it out
Visit [Zwisch](https://zwisch-gemini.web.app) to get started!