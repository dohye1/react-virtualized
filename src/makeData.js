import Chance from "chance";
import { v4 as uuid } from "uuid";

const chanceInstance = new Chance();

// 요청이 들어올때마다 랜덤 데이터를 20개씩 생성해줌
const generateRandomData = (pageNumber) => {
  return Array.from({ length: 30 }).map((_, index) => ({
    id: uuid(),
    name: `${pageNumber}번쨰로 호출한 데이터 :  ${chanceInstance.name()}`,
    height: Math.ceil(Math.random() * 10),
  }));
};

export default function loadMoreData(index) {
  return generateRandomData(index);
}
