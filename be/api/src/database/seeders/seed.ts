import { logger } from '@/utils/logger';
import { DB } from '../index';
import { UserService } from '@/services/users.service';
import { User } from '@/interfaces/users.interface';
import { faker } from '@faker-js/faker';
import { CreateUserDto } from '@/dtos/users.dto';
import { ProductService } from '@/services/products.service';
import { OrderService } from '@/services/orders.service';
import { CategoryService } from '@/services/categories.service';
import { Role, Status } from '@/interfaces/auth.interface';
import { CreateProductDto } from '@/dtos/products.dto';
import { CreateOrderDto, ProductItem } from '@/dtos/orders.dto';
import { OrderStatus } from '@/interfaces/orders.interface';
import { Brands } from '@/interfaces/brands.interface';
import { BrandService } from '@/services/brands.service';
import moment from 'moment-timezone';
import { PRODUCT_IMG } from './constants';

interface SeedAmount {
  users: number;
  products: number;
  ordersPerUser: number;
  itemsPerOrder: number;
}
function getRandomElement(arr: string[]): string {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
class Seeder {
  private seedingAmount: SeedAmount;
  private userService = new UserService();
  private productService = new ProductService();
  private orderService = new OrderService();
  private categoryService = new CategoryService();
  private orderModel = DB.Order;
  private orderItemMode = DB.OrderItem;
  private BrandService = new BrandService();
  constructor(amount: SeedAmount) {
    this.seedingAmount = amount;
  }
  private async SeedCategories() {
    await this.categoryService.CreateCategory({
      name: 'Dog Food',
      desc: 'Dog Food',
    });

    await this.categoryService.CreateCategory({
      name: 'Cat Food',
      desc: 'Cat Food',
    });

    await this.categoryService.CreateCategory({
      name: 'Bird',
      desc: 'Bird Supplies',
    });

    await this.categoryService.CreateCategory({
      name: 'Fish & Aquatic',
      desc: 'Fish & Aquatic',
    });

    await this.categoryService.CreateCategory({
      name: 'Small Pet',
      desc: 'Small Pet Supplies',
    });

    await this.categoryService.CreateCategory({
      name: 'Reptile',
      desc: 'Reptile Supplies',
    });

    await this.categoryService.CreateCategory({
      name: 'Toys',
      desc: 'Pet Toys',
    });

    await this.categoryService.CreateCategory({
      name: 'Grooming',
      desc: 'Groom brush, accesories,...',
    });

    await this.categoryService.CreateCategory({
      name: 'Beds & Furniture',
      desc: 'Pet Beds & Furniture',
    });

    await this.categoryService.CreateCategory({
      name: 'Medicine',
      desc: 'Pet Health and wellness',
    });

    await this.categoryService.CreateCategory({
      name: 'Carriers',
      desc: 'Pet Travel & Carriers',
    });

    await this.categoryService.CreateCategory({
      name: 'Collars',
      desc: 'Pet Collars, Leashes & Harnesses',
    });
  }

  private async SeedUsers() {
    try {
      const { users } = this.seedingAmount;
      const creationPromises: Promise<User>[] = [];
      const district = [
        'District 1',
        'District 2',
        'District 3',
        'District 4',
        'District 5',
        'District 6',
        'District 7',
        'District 8',
        'District 9',
        'District 10',
        'District 11',
        'District 12',
        'Binh Tan',
        'Binh Thanh',
        'Go Vap',
        'Phu Nhuan',
        'Tan Binh',
        'Tan Phu',
        'Thu Duc',
        'Nha Be',
        'Can Gio',
        'Cu Chi',
        'Hoc Mon',
        'Binh Chanh',
      ];
      function getRandomLikedProduct(numProducts: number, maxProductId: number): string[] {
        if (numProducts > maxProductId) {
          throw new Error(`Cannot generate ${numProducts} liked dishes with max ID ${maxProductId}`);
        }
        const likedProducts = new Set<string>();
        while (likedProducts.size < numProducts) {
          likedProducts.add(faker.number.int({ min: 1, max: maxProductId }).toString());
        }
        return Array.from(likedProducts);
      }
      for (let i = 0; i < users; i++) {
        const newUser: CreateUserDto = {
          fullname: faker.person.fullName(),
          email: faker.internet.email(),
          password: '123456',
          phone: faker.phone.number({ style: 'national' }),
          dob: faker.date.past(),
          status: Status.OFFLINE,
          // eslint-disable-next-line prettier/prettier
          address: faker.location.streetAddress() + ', ' + getRandomElement(district) + ', HCM',
          role: i == 0 ? Role.ADMIN : Role.CUSTOMER,
          likedproduct: getRandomLikedProduct(3, 11),
        };
        creationPromises.push(this.userService.createUser(newUser));
      }

      await Promise.all(creationPromises);
      logger.info('User seeding successfully!');
    } catch (error) {
      logger.error('User seeding error!');
      throw error;
    }
  }

  private async SeedOrders() {
    try {
      const { ordersPerUser, itemsPerOrder } = this.seedingAmount;

      const usersList = await this.userService.findAllUser();
      await Promise.all(
        usersList.map(async user => {
          for (let i = 0; i < ordersPerUser; i++) {
            let prodId = 0;
            const productItems: ProductItem[] = Array(itemsPerOrder)
              .fill(null)
              .map(() => {
                prodId = prodId + faker.number.int({ min: 1, max: 6 });
                const productId = prodId;
                const quantity = faker.number.int({ min: 1, max: 5 });
                return { productId, quantity };
              });

            const dto: CreateOrderDto = {
              products: productItems,
              receiptAddress: faker.location.streetAddress(),
              receiptName: faker.person.fullName(),
              receiptPhone: faker.phone.number({ style: 'national' }),
              status: Object.values(OrderStatus)[faker.number.int({ min: 0, max: 2 })],
              orderPrice: faker.number.int({ min: 100, max: 1000 }),
            };

            await this.orderService.createOrder(dto, user.id);
          }
        }),
      );

      logger.info('Order seeding successfully!');
    } catch (error) {
      logger.error('Order seeding error!');
      throw error;
    }
  }
  private async SeedProducts() {
    try {
      const { products } = this.seedingAmount;

      const brands: Brands[] = Array.from({ length: 7 }, (_, i) => ({
        id: i + 1,
        name: faker.company.name(),
      }));
      for (const brand of brands) {
        await this.BrandService.createBrand(brand); // if you have such a service
      }
      for (let i = 0; i < products; i++) {
        const category = faker.number.int({ min: 1, max: 12 });

        const imgs_src = PRODUCT_IMG;

        const imgsSet = new Set<string>();
        while (imgsSet.size < 3) {
          imgsSet.add(imgs_src[faker.number.int({ min: 0, max: imgs_src.length - 1 })]);
        }

        const newProducts: CreateProductDto = {
          name: faker.commerce.productName(),
          desc: faker.commerce.productDescription(),
          price: Number(faker.commerce.price({ max: 120000, min: 8000 })),
          importPrice: Number(faker.commerce.price({ max: 100000 })),
          brandId: brands[faker.number.int({ min: 0, max: brands.length - 1 })].id,
          images: [...imgsSet],
          categoryId: category,
          stock: faker.number.int({ min: 21, max: 300 }),
          sold: faker.number.int({ min: 1, max: 20 }),
          score: faker.number.int({ min: 1, max: 20 }),
        };

        await this.productService.seedProduct(newProducts);
      }

      logger.info('Product seeding successfully!');
    } catch (error) {
      logger.error('Product seeding error!');
      throw error;
    }
  }
  private async ModifyCreatedDate() {
    const orders = await this.orderModel.findAll();

    const now = moment.tz('Asia/Ho_Chi_Minh');
    await Promise.all(
      orders.map(async order => {
        const randomDay = moment(now)
          .clone()
          .subtract(faker.number.int({ min: 1, max: 7 }), 'days')
          .toDate();
        await DB.Order.update({ createdAt: randomDay }, { where: { id: order.id } });
      }),
    );

    const orderItems = await this.orderItemMode.findAll();

    await Promise.all(
      orderItems.map(orderItem => {
        const randomDay = moment(now)
          .clone()
          .subtract(faker.number.int({ min: 1, max: 7 }), 'days')
          .toDate();
        return DB.OrderItem.update({ createdAt: randomDay }, { where: { id: orderItem.id } });
      }),
    );
    logger.info('Modify created date successfully!');
  }
  public async seedAll() {
    await this.SeedUsers();
    await this.SeedCategories();
    await this.SeedProducts();
    await this.SeedOrders();
    await this.ModifyCreatedDate();
  }
}
(async () => {
  try {
    await DB.sequelize.sync({ force: true, alter: true });
    const seeder = new Seeder({
      users: 10,
      products: 40,
      ordersPerUser: 6,
      itemsPerOrder: 4,
    });
    await seeder.seedAll();

    logger.info('Seeding successfully!');
  } catch (error) {
    logger.error('Seeding failed!');
    console.log(error);
  } finally {
    DB.sequelize.close();
    process.exit();
  }
})();
