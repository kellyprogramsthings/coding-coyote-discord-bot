import fs from "fs";
import _ from "lodash";
import Prisma from '@prisma/client';

const { PrismaClient } = Prisma;
const prisma = new PrismaClient();

// one off file not connected to the rest of the app

// read in js file
const rawData = fs.readFileSync("countryCapitals.js");
const countryInfo = JSON.parse(rawData);

// insert to database
_.forEach(countryInfo, async countryCapital => {
  await prisma.countryCapital.upsert({
    where: { country: countryCapital.country },
    update: {},
    create: { country: countryCapital.country, capital: countryCapital.city }
  });
});