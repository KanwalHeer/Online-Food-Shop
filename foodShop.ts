import inquirer from "inquirer";
import chalk from "chalk";
console.log(chalk.yellow("Welcome to our online food shop"));
class FoodItem {
  constructor(public name: string, public price: number) {}
}

class User {
  constructor(
    public name: string,
    public phoneNumber: string,
    public address: string
  ) {}
}

class Order {
  constructor(public user: User, public foodItem: FoodItem) {}
}

class OnlineShop {
  private foodItems: FoodItem[] = [
    new FoodItem("Burger", 5.99),
    new FoodItem("Pizza", 9.99),
    new FoodItem("Fries", 2.49),
    new FoodItem("Chicken Nuggets", 4.99),
    new FoodItem("Taco", 3.49),
    new FoodItem("Chicken Wings", 7.99),
    new FoodItem("Milkshake", 3.99),
    new FoodItem("Cheeseburger", 6.49),
    new FoodItem("Ice Cream Cone", 2.99),
    new FoodItem("Nachos", 4.99),
    new FoodItem("Caesar Salad", 5.49),
    new FoodItem("Smoothie", 4.49),
    new FoodItem("Pasta", 8.99),
    new FoodItem("Fish and Chips", 9.49),
    new FoodItem("Donuts", 2.49),
    new FoodItem("Sushi", 10.99),
    new FoodItem("Burrito", 7.49),
    // Add more halal fast food items here
  ];

  private users: User[] = [];

  public async startShopping(): Promise<void> {
    let exit = false;
    do {
      const answers = await inquirer.prompt({
        name: "action",
        message: "Choose an action:",
        type: "list",
        choices: ["Register", "Exit"],
      });

      switch (answers.action) {
        case "Register":
          await this.registerUser();
          break;
        case "Exit":
          console.log(
            chalk.yellow("Thank you for visiting. Have a great day!")
          );
          exit = true;
          break;
      }
    } while (!exit);
  }

  public async registerUser(): Promise<void> {
    const answers = await inquirer.prompt([
      { name: "name", message: "Enter your name:" },
      { name: "phoneNumber", message: "Enter your phone number:" },
      { name: "address", message: "Enter your address:" },
    ]);

    const user = new User(answers.name, answers.phoneNumber, answers.address);
    this.users.push(user);
    console.log(chalk.green("User registered successfully!"));
    await this.chooseFood(user);
  }

  public async chooseFood(user: User): Promise<void> {
    console.log(chalk.magenta("Available Food Items:"));
    const foodChoices = this.foodItems.map((item) => ({
      name: `${item.name} - $${item.price.toFixed(2)}`,
      value: item,
    }));
    const answer = await inquirer.prompt({
      name: "selection",
      message: "Choose your food item:",
      type: "list",
      choices: foodChoices,
    });

    const selectedFoodItem: FoodItem = answer.selection;

    let userEnteredPrice: number;

    const paymentAnswer = await inquirer.prompt({
      type: "confirm",
      name: "paymentConfirmed",
      message: "Do you want to make payment now?",
    });
    if (paymentAnswer.paymentConfirmed) {
      do {
        const paymentAnswer = await inquirer.prompt({
          type: "input",
          name: "userEnteredPrice",
          message: "Enter the price of the food item:",
        });
        userEnteredPrice = parseFloat(paymentAnswer.userEnteredPrice);
        if (userEnteredPrice < selectedFoodItem.price) {
          console.log(
            chalk.redBright(
              `You have paid less amount. Actual price is: $${selectedFoodItem.price.toFixed(
                2
              )}`
            )
          );
          console.log(chalk.redBright("Please enter the correct amount."));
        } else if (userEnteredPrice > selectedFoodItem.price) {
          const extraAmount = userEnteredPrice - selectedFoodItem.price;
          console.log(
            chalk.blueBright(
              `You have paid extra amount from actual amount. Your extra price is: $${extraAmount.toFixed(
                2
              )} it will be refunded upon delivery.`
            )
          );
          console.log(
            chalk.green(
              "Your order has been placed. Please make payment upon delivery."
            )
          );

          this.orderFood(new Order(user, selectedFoodItem));
        } else {
          console.log(
            chalk.green(
              "Payment successful! Your order will be delivered soon."
            )
          );
          this.orderFood(new Order(user, selectedFoodItem));
        }
      } while (userEnteredPrice < selectedFoodItem.price);
    } else {
      console.log(
        chalk.green(
          "Payment successful! Your order will be delivered soon.'You can make payment after delivery."
        )
      );
      this.orderFood(new Order(user, selectedFoodItem));
    }
  }

  public orderFood(order: Order): void {
    console.log(chalk.magenta("Order placed successfully!"));
    console.log(chalk.magenta(`You ordered: ${order.foodItem.name}`));
    console.log(
      chalk.magenta(`Delivery will be done soon to ${order.user.address}`)
    );
  }
}

const shop = new OnlineShop();
shop.startShopping();
