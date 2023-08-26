export default class userDTO {
  constructor(user) {
    this.id = user._id 
    this.userCart = user.cart? user.cart._id : undefined
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.age = user.age;
    this.email = user.email;
    this.fullName = `${this.firstName} ${this.lastName}`;
    this.rol = user.rol;
    this.isAdmin = false;
  }
}
