import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const blogPosts = [
  {
    title: '10 Tips for Better Budgeting',
    description: 'Learn how to create and stick to a budget that works for you.',
    date: '2023-06-01',
    slug: '10-tips-for-better-budgeting'
  },
  {
    title: 'Understanding Your Credit Score',
    description: 'Demystifying credit scores and how to improve yours.',
    date: '2023-05-15',
    slug: 'understanding-your-credit-score'
  },
  {
    title: 'Investing for Beginners',
    description: 'A simple guide to start your investment journey.',
    date: '2023-04-28',
    slug: 'investing-for-beginners'
  }
]

export function BlogSection() {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Financial Tips & Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>{post.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">{post.description}</p>
                <Link href={`/blog/${post.slug}`} passHref>
                  <Button variant="link">Read More</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <Link href="/blog" passHref>
            <Button size="lg">View All Posts</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

