# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

Document.create(
  [
    {
      title: 'Docs',
      description: 'Find in-depth information about Next.js features and API.',
      link: 'https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app'
    },
    {
      title: 'Learn',
      description: 'Learn about Next.js in an interactive course with&nbsp;quizzes!',
      link: 'https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app'
    },
    {
      title: 'Templates',
      description: 'Discover and deploy boilerplate example Next.js&nbsp;projects.',
      link: 'https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app'
    },
    {
      title: 'Deploy',
      description: 'Instantly deploy your Next.js site to a shareable URL with Vercel.',
      link: 'https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app'
    }
  ]
)

User.create!([
  { id: 1, name: "Diana Salha", major: "no major", graduation_year: 2000, user_profile_url: "", biography: "", email: "dianasalha123@tamu.edu" },
  { id: 2, name: "Anish Easerwan", major: "no major", graduation_year: 2000, user_profile_url: "", biography: "", email: "anish.easwaran@tamu.edu" },
  { id: 3, name: "Fouzul Kansul", major: "no major", graduation_year: 2000, user_profile_url: "", biography: "", email: "fouzul.k@tamu.edu" }
])

Achievement.create!([
  { id: 1, name: "Aggie Pitch", description: "2nd place 2023", user_id: 1 },
  { id: 2, name: "Ideas Challenge", description: "6th place 2023", user_id: 1 },
  { id: 3, name: "Problems Worth Solving", description: "1st place 2024", user_id: 1 },
  { id: 4, name: "Meloy Grants", description: "Innovator $2500", user_id: 1 },
  { id: 5, name: "(at A&M 3k)", description: "NSF I-Corps Site x2", user_id: 1 },
  { id: 6, name: "(at A&M 3k)", description: "NSF I-Corps Site", user_id: 2 },
  { id: 7, name: "Meloy Grants", description: "Fellow $10k", user_id: 2 },
  { id: 8, name: "Ideas Challenge", description: "3rd place 2023", user_id: 2 },
  { id: 9, name: "Aggie Pitch", description: "1st place 2024", user_id: 2 }
])

ContactMethod.create!([
  { id: 1, contact_type: "Email", info: "dianasalha123@tamu.edu", user_id: 1 },
  { id: 2, contact_type: "Email", info: "anish.easwaran@tamu.edu", user_id: 2 },
  { id: 3, contact_type: "Email", info: "fouzul.k@tamu.edu", user_id: 3 },
  { id: 4, contact_type: "LinkedIn", info: "https://www.linkedin.com/", user_id: 1 }
])
