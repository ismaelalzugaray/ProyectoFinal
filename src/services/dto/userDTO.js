export default class userDTO {
  constructor(user) {
    user._id? this.id = user._id:
    user.cart? this.userCart = user.cart._id: null
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.age = user.age;
    this.email = user.email;
    this.fullName = `${this.firstName} ${this.lastName}`;
    this.rol = user.rol;
    this.isAdmin = false;
  }
}
