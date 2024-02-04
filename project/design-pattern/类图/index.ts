class Animal {
    constructor() { }
    public eat() { }
    public drink() { }
}
// 接口
interface Eggs {
    giveEggs(): number
}
class Bird extends Animal implements Eggs {
    public swing: number
    public fly() { }
    giveEggs(): number {
        return 2
    }
}
class TangFather { }
class TangFriend { }
class TangWife { }
class TangChild { }
class TangHouse { }
class TangDuck extends Bird {
    public father: TangFather
    public friends: Array<TangFriend>
    public wife: TangWife
    public children: Array<TangChild>
    public house: Array<TangHouse>
}
class BigBirdKidney {}
// 组合
class BigBird extends Bird {
    public kidney: Array<BigBirdKidney>
}
// 聚合
class BigBirdGroup {
    public birds: Array<BigBird>
}