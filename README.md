# Comiteer

Comiteer brings together nonprofit organizations and students, to share their time, resources, services and skills to enable meaningful change in our community. Our platform allows students to discover nearby volunteering opportunities that interest them and then connects them with the organisers through a safe messaging platform.

Comiteer won the 2021 edition of the [AWS Build On ASEAN](https://www.buildonasean2021.com). Our team consisted of Sam Poder (me!), Arsh Shrivastava & Neil Ghosh. Arsh & Neil focused on the business and presentation whilst I made the code!

### Pitch

If you are curious, the following was our pitch in the finals.

**Arsh:** 

Good evening,

Every year, a growing number of students are required to participate in volunteering activities in the community. 

This part of the curriculum holds excellent potential; yet our research shows that this potential is not being utilized for the community.

85% of these students want to make a meaningful difference with their volunteering. However, only 22% of students feel that their current volunteering is worthwhile

For service learning to meet it’s true potential, we need to close this massive gap. Doing so would help us enable an increased amount of effective sharing of time, resources, services and skills within the community.

So, how do we close this gap? 92% of these students identified finding volunteer opportunities as the key issue holding them back. 

Common secondary issues identified include: contacting non profit organizations and finding opportunities near where they live. 

At the same time, despite an increase in students looking to volunteer, 80% of non profit organizations report that they have not observed an increase in students getting involved with their volunteer programs.

Comiteer brings together nonprofit organizations and students, to share their time, resources, services and skills to enable meaningful change in our community. Our solution allows students to discover nearby volunteering opportunities that interest them and then connects them with the organisers through a safe messaging platform.

We set out to make Comiteer easy and safe with the broader goal of establishing a thriving, sustainable community. We believe the best way to achieve a sustainable community is through targeting the youth as they are

1. Full of energy and passion that a community needs to thrive, our surveys have shown that the youth have the commitment and belief required for service, with  85% of these students wanting to make a meaningful difference with their volunteering.
2. They are a large and growing demographic, more and more schools are expanding into service learning, 50% of our surveyed students stated that service learning had only come into their schools in the past five years. This gives us the numbers for a thriving and vibrant community.
3. Lastly, these youth are shaping what their future lives will be and by providing positive service experiences we can set up a lifelong passion for service. This lifelong passion keeps our community sustainable.

I would now hand it over to Sam, who will show you how our solution works! 

**Sam:** 

So let’s jump right into Comiteer on my phone, we start at the map which is at the center of the Comiteer experience. Here we are in my local area, let’s take a look around for let’s say an education volunteering opportunity. We can filter out these results for education related opportunities. Here’s one that looks interesting, let’s click it. Hmm, I think I might give this a go. I’m going to message them. So the person I’m messaging here is “NAME”, I can tell they’re a certain age range and can be assured that their details have been verified through SingPass, which I’ll run through in a bit. We can message back and forth, and arrange a time for me to get involved.

Now let’s head back home this time on the web version, to take a deep dive into the key focuses of this prototype: discoverability and safety.

Discoverability all focuses around the map and three themes: localisation, visual markers and speed.

Localisation is important for us as it provides the user with a familiar interface that they can understand and relate with. An example of this is this handy button in the bottom right which allows us to focus the map on their current location. This allows the user to focus on the opportunities around them.

Secondly, visual markers. We heard a lot from users about not enjoying UIs that overload them with text, so we stripped back on the text and focused on the visuals. For example, we gave each category a distinct colour with the key on the side that makes every marker on the map more recognisable.

Lastly, speed. We believe that users should be able to find opportunities fast. Just take a look at how fast search is here, we’ve optimised our app through dynamic loading and careful state management set up to make sure the user has the best experience. In fact, when using our platform 75% of students found an opportunity that interested them within three minutes.

This focus on the discoverability process is the reason why 89% of our target market found the platform easy to use when testing it.

As I alluded to earlier, security and safety is critical for our users. We take a three prong approach to safety: protect, educate and act.

Let’s begin with protection. We protect our user base by requiring all new users to verify their identity including name and age through SingPass as is demonstrated on screen through a new user logging in. This filters our spam bots and potential bad actors from entering the platform. SingPass is a government platform widely used in Singapore, and the most accurate method of identity verification in Singapore. We also protect the platform from spam posting, by requiring a manual review for each posting.

Now let’s transition to educate, being targeted towards the youth we know that everyone has room to grow and learn. When messaging, we prompt users who are consistently being negative in their messages to evaluate their messages and rethink how they are communicating as shown on screen.

Lastly, action. Unfortunately, we can not fully rule out bad actors on the platform. In these cases, we make reporting users as easy as one-two-three. As you can see you can report them by clicking this icon here, quickly fill out the form and then get redirected to this page in which you can monitor the status of your report, keeping the process open and transparent for the user.

It’s critical that our users are safe and this three prong approach ensures that.

AWS is at the core of our application, we host our statically generated Next.js frontend on AWS Amplify. The frontend uses Theme UI & Framer Motion for styling, Mapbox to serve the client maps & SWR’s React Hooks to fetch data from our Serverless API. This serverless API is powered by Node.js and hosted with AWS Lambda Functions. It uses next-auth for authentication and Prisma to communicate with our PostgreSQL database hosted on AWS Relational Database Service. The Lambda functions work with AWS SES over SMTP to send emails and with AWS S3 to host static files. With AWS at the foundation of app, we can serve a fast experience to all users, develop new features at a rapid pace and use conserve financial resources.

Now I will be handing it over to Neil, who will talk about the business viability of our product.

**Neil:**

With this rapidly growing market, Comiteer has great business potential. This will be achieved through offering a product for schools. 

We intend to offer a school license for our platform that unlocks additional features for them and their students, this includes: more meticulous control over the student experience, advanced safety features, internal social features and integration with pre-existing school portals. 

Schools across the country are facing similar problems as their students with service learning. We found out that 75% of educators find it difficult to arrange volunteering opportunities for their students. Furthermore, 85% would be willing to purchase a Comiteer school license to simplify this process. The median price these educators were willing to pay was $2,000 SGD for every 1,000 students. This evidently shows that there is a need for our product in the education sector, and due to its abundance of resources and funding, we will market our idea directly to them. 

This would also provide us with a sustainable stream of revenue to fund our platform upkeep and the development of new features. Most importantly, it will mean that we can continue to connect students with non profit organisations without having to charge them.

Going beyond our current prototype, we plan to build a dedicated dashboard for organisations to use when posting opportunities. We will also provide more moderation tools to keep our users safe and add more functionality to our chat system with Amazon Chime. Additionally, we will expand our product into supporting one time volunteering opportunities and give organisers the tools they need to run these events.

Lastly, we intend to build partnerships with preferred organisations that will be verified further. This will add additional legitimacy and offer Comiteer-exclusive opportunities to make the product more valuable.

To conclude,

* We’ve got a large demographic full of passion and potential that is currently not being provided with the resources they need to reach their potential in the community.
* We’ve got a fast and safe product that has proven user satisfaction.
* Lastly, a market of schools that are willing to invest in the platform to keep it running.

If you’re looking to establish **sustainable** and **thriving** communities around volunteering, it's time to commit to Comiteer! 

Now we will open the floor for a Q&A Session
