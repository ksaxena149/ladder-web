import { PrismaClient } from '@prisma/client';
import billsData from '../src/data/bills.json';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed the database...');
  
  // Clear existing bills
  await prisma.chatMessage.deleteMany();
  await prisma.bill.deleteMany();
  
  console.log('Database cleared. Adding bills...');
  
  // Add bills from our sample data
  for (const bill of billsData) {
    await prisma.bill.create({
      data: {
        id: bill.id,
        title: bill.title,
        publicationDate: new Date(bill.publication_date),
        pdfUrl: bill.pdf_url,
      },
    });
  }
  
  const billCount = await prisma.bill.count();
  console.log(`Database seeded with ${billCount} bills.`);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 