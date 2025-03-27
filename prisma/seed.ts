import { faker } from "@faker-js/faker";
import { prisma } from "./prisma";
import {
  type Category,
  type Product,
  type ProductVariation,
  type SubCategory,
  type User,
} from "@prisma/client";

async function main() {
  //create 5 users
  console.log("Creando Usuarios");
  const users = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      return await prisma.user.create({
        data: {
          email: faker.internet.email(),
          password: faker.internet.password(),
          first_name: faker.person.firstName(),
          last_name: faker.person.lastName(),
          image: faker.image.avatar(),
        },
      });
    })
  );

  console.log("Creando Categorias");
  const categories = await Promise.all(
    Array.from({ length: 10 }).map(async () => {
      return await prisma.category.create({
        data: {
          name: faker.commerce.department(),
        },
      });
    })
  );
  console.log("Creando los pagos y direcciones para los Usuarios");
  //crea 1 metodo de pago para cada usuario
  await Promise.all(
    users.map(async (user: User) => {
      await Promise.all(
        Array.from({ length: 1 }).map(async () => {
          return await prisma.payment.create({
            data: {
              User: { connect: { id: user.id } },
              payment_date: faker.date.anytime(),
              payment_method: faker.finance.transactionType(),
            },
          });
        })
      );
      //crea una direccion para cada usuario
      await Promise.all(
        Array.from({ length: 1 }).map(async () => {
          return await prisma.address.create({
            data: {
              user: { connect: { id: user.id } },
              city: faker.location.city(),
              country: faker.location.country(),
              street1: faker.location.streetAddress(),
              zip_code: faker.location.zipCode(),
            },
          });
        })
      );
    })
  );
  console.log("Creando las subcategories para las Categorias");
  const subCategories: SubCategory[] = [];

  await Promise.all(
    // Crea 2 subcategorias para cada categoría
    categories.map(async (category: Category) => {
      const categoryProducts = await Promise.all(
        Array.from({ length: 2 }).map(async () => {
          return await prisma.subCategory.create({
            data: {
              Category: { connect: { id: category.id } },
              name: faker.commerce.product(),
            },
          });
        })
      );
      subCategories.push(...categoryProducts); // Agregar productos al array
    })
  );
  console.log("Creando los productos para las Subcategories");
  const products: Product[] = [];
  // Crea 2 productos para cada subcategoria
  await Promise.all(
    subCategories.map(async (subCategory: SubCategory) => {
      const subCategoryProducts = await Promise.all(
        Array.from({ length: 2 }).map(async () => {
          return await prisma.product.create({
            data: {
              SubCategory: { connect: { id: subCategory.id } },
              name: faker.commerce.productName(),
            },
          });
        })
      );
      products.push(...subCategoryProducts); // Agregar productos al array
    })
  );

  console.log("Creando las Imágenes para los Productos");
  const variationsProducts: ProductVariation[] = [];

  await Promise.all(
    products.map(async (product) => {
      const productVar = await Promise.all(
        Array.from({ length: 5 }).map(async () => {
          return await prisma.productVariation.create({
            data: {
              Product: { connect: { id: product.id } },
              color: faker.color.rgb(),
              price: parseFloat(faker.commerce.price({ min: 20, max: 200 })),
              contexture: faker.commerce.productAdjective(),
            },
          });
        })
      );
      variationsProducts.push(...productVar);
    })
  );
  console.log("Creando el stock");
  await Promise.all(
    variationsProducts.map(async (variation) => {
      await Promise.all(
        Array.from({ length: 5 }).map(async () => {
          return await prisma.productVariationSizeStock.create({
            data: {
              ProductVariation: { connect: { id: variation.id } },
              size: faker.helpers.arrayElement(["3xl", "xl", "l", "m", "s"]),
              SKU: faker.commerce.isbn(),
              stock: faker.number.int({ max: 40, min: 1 }),
            },
          });
        })
      );
    })
  );
  console.log("Creando Las Imagenes");
  await Promise.all(
    variationsProducts.map(async (variation) => {
      await Promise.all(
        Array.from({ length: 5 }).map(async () => {
          return await prisma.image.create({
            data: {
              ProductVariation: { connect: { id: variation.id } },
              filename: faker.image.url(),
            },
          });
        })
      );
    })
  );
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
