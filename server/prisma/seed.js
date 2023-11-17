const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const patty = await prisma.users.upsert({
        where: { username: 'pattyt' },
        update: {},
        create: {
            username: 'pattyt',
            password: 'password',
            posts: {
                create: [
                    {
                        title: 'Happy Home',
                        content: 'I am happy when I am home with my family'
                    },

                    {
                        title: 'I love Walking',
                        content: 'Walking is best when done with music'
                    },

                    {
                        title: 'Thanksgiving',
                        content: 'I enjoy the holiday season!'
                    }
                ]
            }
        }
    })

    const john = await prisma.users.upsert({
        where: { username: 'johnp' },
        update: {},
        create: {
            username: 'johnp',
            password: 'password',
            posts: {
                create: [
                    {
                        title: 'Summer',
                        content: 'The summer is my favorite season!'
                    },

                    {
                        title: 'Beach Weather',
                        content: 'I enjoy swimming during the summer'
                    },

                    {
                        title: 'Fourth of July',
                        content: 'I went to see fireworks today!'
                    }
                ]
            }
        }
    })

    const susan = await prisma.users.upsert({
        where: { username: 'susank' },
        update: {},
        create: {
            username: 'susank',
            password: 'password',
            posts: {
                create: [
                    {
                        title: 'Hanging with Friends',
                        content: "Today I went to a old friend's house!"
                    },

                    {
                        title: 'Packing!',
                        content: 'packing can be stressful, but new places are cool!'
                    },

                    {
                        title: 'Eating Pizza',
                        content: 'Pizza is one of my favorite food items!'
                    }
                ]
            }
        }
    })
    console.log(patty, susan, john);

}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (error) => {
        console.error(error)
        await prisma.$disconnect()
        process.exit(1)
    })
