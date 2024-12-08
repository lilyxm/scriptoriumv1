const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { connect } = require("http2");

const prisma = new PrismaClient();
const saltRounds = 10;

async function main() {
  // Create users
  const adminPassword = await bcrypt.hash("admin_password", saltRounds);
  const userPassword1 = await bcrypt.hash("user_password1", saltRounds);
  const userPassword2 = await bcrypt.hash("user_password2", saltRounds);
  const userPassword3 = await bcrypt.hash("user_password3", saltRounds);
  const userPassword4 = await bcrypt.hash("user_password4", saltRounds);

  const adminUser = await prisma.user.create({
    data: {
      username: "admin",
      password: adminPassword,
      role: "ADMIN",
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      phoneNumber: "1234567890",
    },
  });

  const user1 = await prisma.user.create({
    data: {
      username: "user1",
      password: userPassword1,
      role: "USER",
      firstName: "User",
      lastName: "One",
      email: "user1@example.com",
      phoneNumber: "1234567890",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "user2",
      password: userPassword2,
      role: "USER",
      firstName: "User",
      lastName: "Two",
      email: "user2@example.com",
      phoneNumber: "1234567890",
    },
  });

  const user3 = await prisma.user.create({
    data: {
      username: "user3",
      password: userPassword3,
      role: "USER",
      firstName: "User",
      lastName: "Three",
      email: "user3@example.com",
      phoneNumber: "1234567890",
    },
  });

  const user4 = await prisma.user.create({
    data: {
      username: "user4",
      password: userPassword4,
      role: "USER",
      firstName: "User",
      lastName: "Four",
      email: "user4@example.com",
      phoneNumber: "1234567890",
    },
  });

  // Create code templates
  const template1 = await prisma.codeTemplate.create({
    data: {
      title: "Hello World",
      description: "Prints 'Hello, World!'",
      language: "c",
      authorId: user1.id,
      code: `#include <stdio.h>

int main() {
        printf("Hello, World!");
        return 0;
}`,
    },
  });

  const template2 = await prisma.codeTemplate.create({
    data: {
      title: "Sum of Two Numbers",
      description: "Calculates the sum of two integers",
      language: "c",
      authorId: user2.id,
      code: `#include <stdio.h>

  int main() {
          int a, b, sum;
          printf("Enter two integers: ");
          scanf("%d %d", &a, &b);
          sum = a + b;
          printf("Sum: %d", sum);
          return 0;
  }`,
    },
  });

  const template3 = await prisma.codeTemplate.create({
    data: {
      title: "Factorial",
      description: "Calculates the factorial of a number",
      language: "c",
      authorId: user3.id,
      code: `#include <stdio.h>

  int factorial(int n) {
          if (n == 0)
                  return 1;
          else
                  return n * factorial(n - 1);
  }

  int main() {
          int num;
          printf("Enter a number: ");
          scanf("%d", &num);
          printf("Factorial of %d is %d", num, factorial(num));
          return 0;
  }`,
    },
  });

  const template4 = await prisma.codeTemplate.create({
    data: {
      title: "Hello World",
      description: "Prints 'Hello, World!'",
      language: "cpp",
      authorId: user4.id,
      code: `#include <iostream>

  int main() {
      std::cout << "Hello, World!" << std::endl;
      return 0;
  }`,
    },
  });

  const template5 = await prisma.codeTemplate.create({
    data: {
      title: "Sum of Two Numbers",
      description: "Calculates the sum of two integers",
      language: "cpp",
      authorId: user1.id,
      code: `#include <iostream>

  int main() {
      int a, b;
      std::cout << "Enter two integers: ";
      std::cin >> a >> b;
      std::cout << "Sum: " << a + b << std::endl;
      return 0;
  }`,
    },
  });

  const template6 = await prisma.codeTemplate.create({
    data: {
      title: "Factorial",
      description: "Calculates the factorial of a number",
      language: "cpp",
      authorId: user2.id,
      code: `#include <iostream>

  int factorial(int n) {
      if (n == 0)
              return 1;
      else
              return n * factorial(n - 1);
  }

  int main() {
      int num;
      std::cout << "Enter a number: ";
      std::cin >> num;
      std::cout << "Factorial of " << num << " is " << factorial(num) << std::endl;
      return 0;
  }`,
    },
  });

  const template7 = await prisma.codeTemplate.create({
    data: {
      title: "Hello World",
      description: "Prints 'Hello, World!'",
      language: "java",
      authorId: user3.id,
      code: `public class HelloWorld {
      public static void main(String[] args) {
              System.out.println("Hello, World!");
      }
  }`,
    },
  });

  const template8 = await prisma.codeTemplate.create({
    data: {
      title: "Sum of Two Numbers",
      description: "Calculates the sum of two integers",
      language: "java",
      authorId: user4.id,
      code: `import java.util.Scanner;

  public class SumOfTwoNumbers {
      public static void main(String[] args) {
              Scanner scanner = new Scanner(System.in);
              System.out.println("Enter two integers: ");
              int a = scanner.nextInt();
              int b = scanner.nextInt();
              int sum = a + b;
              System.out.println("Sum: " + sum);
      }
  }`,
    },
  });

  const template9 = await prisma.codeTemplate.create({
    data: {
      title: "Factorial",
      description: "Calculates the factorial of a number",
      language: "java",
      authorId: user1.id,
      code: `import java.util.Scanner;

  public class Factorial {
      public static int factorial(int n) {
              if (n == 0)
                      return 1;
              else
                      return n * factorial(n - 1);
      }

      public static void main(String[] args) {
              Scanner scanner = new Scanner(System.in);
              System.out.println("Enter a number: ");
              int num = scanner.nextInt();
              System.out.println("Factorial of " + num + " is " + factorial(num));
      }
  }`,
    },
  });

  const template10 = await prisma.codeTemplate.create({
    data: {
      title: "Hello World",
      description: "Prints 'Hello, World!'",
      language: "python",
      authorId: user2.id,
      code: `print("Hello, World!")`,
    },
  });

  const template11 = await prisma.codeTemplate.create({
    data: {
      title: "Sum of Two Numbers",
      description: "Calculates the sum of two integers",
      language: "python",
      authorId: user3.id,
      code: `a = int(input("Enter first number: "))
b = int(input("Enter second number: "))
sum = a + b
print("Sum:", sum)`,
    },
  });

  const template12 = await prisma.codeTemplate.create({
    data: {
      title: "Factorial",
      description: "Calculates the factorial of a number",
      language: "python",
      authorId: user4.id,
      code: `def factorial(n):
    if n == 0:
            return 1
    else:
            return n * factorial(n - 1)

num = int(input("Enter a number: "))
print("Factorial of", num, "is", factorial(num))`,
    },
  });

  const template13 = await prisma.codeTemplate.create({
    data: {
      title: "Hello World",
      description: "Prints 'Hello, World!'",
      language: "javascript",
      authorId: user1.id,
      code: `console.log("Hello, World!");`,
    },
  });

  const template14 = await prisma.codeTemplate.create({
    data: {
      title: "Sum of Two Numbers",
      description: "Calculates the sum of two integers",
      language: "javascript",
      authorId: user2.id,
      code: `const a = parseInt(prompt("Enter first number: "));
const b = parseInt(prompt("Enter second number: "));
const sum = a + b;
console.log("Sum:", sum);`,
    },
  });

  const template15 = await prisma.codeTemplate.create({
    data: {
      title: "Factorial",
      description: "Calculates the factorial of a number",
      language: "javascript",
      authorId: user3.id,
      code: `function factorial(n) {
    if (n === 0) {
            return 1;
    } else {
            return n * factorial(n - 1);
    }
}

const num = parseInt(prompt("Enter a number: "));
console.log("Factorial of " + num + " is " + factorial(num));`,
    },
  });

  // Create blog posts
  const blog1 = await prisma.blogPost.create({
    data: {
      title: "Hello World in C",
      content: "This is a simple program that prints 'Hello, World!'",
      description: "Prints 'Hello, World!'",
      authorId: user1.id,
      likendTemp: {
        connect: { id: template1.id },
      },
    },
  });

  const blog2 = await prisma.blogPost.create({
    data: {
      title: "Understanding Recursion",
      content:
        "Recursion is a method where the solution to a problem depends on solutions to smaller instances of the same problem.",
      BlogPostTag: {
        create: [{ name: "Recursion" }],
      },
      description: "An introduction to recursion.",
      authorId: user2.id,
    },
  });

  const blog3 = await prisma.blogPost.create({
    data: {
      title: "Introduction to JavaScript",
      content:
        "JavaScript is a versatile programming language used for web development.",
      BlogPostTag: {
        create: [{ name: "javascript" }],
      },
      description: "Basics of JavaScript.",
      authorId: user3.id,
    },
  });

  const blog4 = await prisma.blogPost.create({
    data: {
      title: "Getting Started with Python",
      content:
        "Python is a popular programming language known for its simplicity and readability.",
      BlogPostTag: {
        create: [{ name: "python" }],
      },
      description: "Introduction to Python programming.",
      authorId: user4.id,
    },
  });

  const blog5 = await prisma.blogPost.create({
    data: {
      title: "Object-Oriented Programming in Java",
      content:
        "Java is a widely-used programming language that supports object-oriented programming.",
      BlogPostTag: {
        create: [{ name: "java" }],
      },
      description: "Basics of OOP in Java.",
      authorId: user1.id,
    },
  });

  const blog6 = await prisma.blogPost.create({
    data: {
      title: "Understanding Asynchronous JavaScript",
      content:
        "Asynchronous JavaScript allows for non-blocking operations, making it possible to perform tasks like fetching data from a server without freezing the user interface.",
      BlogPostTag: {
        create: [{ name: "Asynchronous" }],
      },
      description: "Introduction to asynchronous programming in JavaScript.",
      authorId: user2.id,
    },
  });

  const blog7 = await prisma.blogPost.create({
    data: {
      title: "Introduction to SQL",
      content:
        "SQL is a standard language for accessing and manipulating databases.",
      BlogPostTag: {
        create: [{ name: "SQL" }],
      },
      description: "Basics of SQL.",
      authorId: user3.id,
    },
  });

  const blog8 = await prisma.blogPost.create({
    data: {
      title: "Introduction to HTML",
      content: "HTML is the standard markup language for creating web pages.",
      BlogPostTag: {
        create: [{ name: "HTML" }],
      },
      description: "Basics of HTML.",
      authorId: user4.id,
    },
  });

  const blog9 = await prisma.blogPost.create({
    data: {
      title: "CSS for Beginners",
      content: "CSS is used to style and layout web pages.",
      BlogPostTag: {
        create: [{ name: "CSS" }],
      },
      description: "Introduction to CSS.",
      authorId: user1.id,
    },
  });

  const blog10 = await prisma.blogPost.create({
    data: {
      title: "Getting Started with React",
      content: "React is a JavaScript library for building user interfaces.",
      BlogPostTag: {
        create: [{ name: "React" }],
      },
      description: "Introduction to React.",
      authorId: user2.id,
    },
  });

  const blog11 = await prisma.blogPost.create({
    data: {
      title: "Understanding REST APIs",
      content:
        "REST APIs allow different software applications to communicate with each other.",
      BlogPostTag: {
        create: [{ name: "REST" }],
      },
      description: "Basics of REST APIs.",
      authorId: user3.id,
    },
  });

  const blog12 = await prisma.blogPost.create({
    data: {
      title: "Introduction to Node.js",
      content:
        "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
      BlogPostTag: {
        create: [{ name: "Node.js" }],
      },
      description: "Basics of Node.js.",
      authorId: user4.id,
    },
  });

  const blog13 = await prisma.blogPost.create({
    data: {
      title: "Hello World Programs",
      content:
        "This blog post covers 'Hello World' programs in various languages including C, C++, Java, Python, and JavaScript.",
      BlogPostTag: {
        create: [{ name: "Hello World" }],
      },
      description: "Hello World programs in multiple languages.",
      authorId: user1.id,
      likendTemp: {
        connect: [
          { id: template1.id },
          { id: template4.id },
          { id: template7.id },
          { id: template10.id },
          { id: template13.id },
        ],
      },
    },
  });

  const blog14 = await prisma.blogPost.create({
    data: {
      title: "Sum of Two Numbers in Different Languages",
      content:
        "This blog post demonstrates how to calculate the sum of two numbers in C, C++, Java, Python, and JavaScript.",
      BlogPostTag: {
        create: [{ name: "Sum of Two Numbers" }],
      },
      description: "Sum of two numbers in multiple languages.",
      authorId: user2.id,
      likendTemp: {
        connect: [
          { id: template2.id },
          { id: template5.id },
          { id: template8.id },
          { id: template11.id },
          { id: template14.id },
        ],
      },
    },
  });

  const blog15 = await prisma.blogPost.create({
    data: {
      title: "Factorial Calculation in Various Languages",
      content:
        "This blog post explains how to calculate the factorial of a number in C, C++, Java, Python, and JavaScript.",
      BlogPostTag: {
        create: [{ name: "Factorial" }],
      },
      description: "Factorial calculation in multiple languages.",
      authorId: user3.id,
      likendTemp: {
        connect: [
          { id: template3.id },
          { id: template6.id },
          { id: template9.id },
          { id: template12.id },
          { id: template15.id },
        ],
      },
    },
  });

  const blog16 = await prisma.blogPost.create({
    data: {
      title: "Introduction to C and C++",
      content:
        "This blog post introduces the basics of C and C++ programming languages with example code templates.",
      BlogPostTag: {
        create: [{ name: "c" }, { name: "cpp" }],
      },
      description: "Basics of C and C++ programming.",
      authorId: user4.id,
      likendTemp: {
        connect: [
          { id: template1.id },
          { id: template2.id },
          { id: template3.id },
          { id: template4.id },
          { id: template5.id },
          { id: template6.id },
        ],
      },
    },
  });

  const blog17 = await prisma.blogPost.create({
    data: {
      title: "Java and Python Programming Basics",
      content:
        "This blog post covers the basics of Java and Python programming languages with example code templates.",
      BlogPostTag: {
        connect: [{ name: "java" }, { name: "python" }],
      },
      description: "Basics of Java and Python programming.",
      authorId: user1.id,
      likendTemp: {
        connect: [
          { id: template7.id },
          { id: template8.id },
          { id: template9.id },
          { id: template10.id },
          { id: template11.id },
          { id: template12.id },
        ],
      },
    },
  });

  // Create comments

  // Comment and replies on blog post 1
  const comment1 = await prisma.comment.create({
    data: {
      content: "Great post!",
      authorId: user1.id,
      blogPostId: blog1.id,
      replyToID: 1,
      replyToType: "blog_post",
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      content: "Thanks!",
      authorId: user2.id,
      blogPostId: blog1.id,
      replyToID: 1,
      replyToType: "comment",
    },
  });

  const comment3 = await prisma.comment.create({
    data: {
      content: "Nice!",
      authorId: user3.id,
      blogPostId: blog1.id,
      replyToID: 2,
      replyToType: "comment",
    },
  });

  // Comment and replies on blog post 4
  const comment4 = await prisma.comment.create({
    data: {
      content: "Interesting post!",
      authorId: user4.id,
      blogPostId: blog4.id,
      replyToID: 4,
      replyToType: "blog_post",
    },
  });

  const comment5 = await prisma.comment.create({
    data: {
      content: "Thanks!",
      authorId: user1.id,
      blogPostId: blog4.id,
      replyToID: 4,
      replyToType: "comment",
    },
  });

  const comment6 = await prisma.comment.create({
    data: {
      content: "I dont understand",
      authorId: user2.id,
      blogPostId: blog4.id,
      replyToID: 4,
      replyToType: "blog_post",
    },
  });

  const comment7 = await prisma.comment.create({
    data: {
      content: "I can help you",
      authorId: user3.id,
      blogPostId: blog4.id,
      replyToID: 6,
      replyToType: "comment",
    },
  });

  // Comment and replies on blog post 15
  const comment8 = await prisma.comment.create({
    data: {
      content: "Slay!",
      authorId: user4.id,
      blogPostId: blog15.id,
      replyToID: 15,
      replyToType: "blog_post",
    },
  });

  const comment9 = await prisma.comment.create({
    data: {
      content: "Thanks!",
      authorId: user1.id,
      blogPostId: blog15.id,
      replyToID: 8,
      replyToType: "comment",
    },
  });

  const comment10 = await prisma.comment.create({
    data: {
      content: "I dont like it!",
      authorId: user2.id,
      blogPostId: blog15.id,
      replyToID: 15,
      replyToType: "blog_post",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
