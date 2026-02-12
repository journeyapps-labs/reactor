import { faker } from '@faker-js/faker';
import * as _ from 'lodash';

faker.seed(1337);

export class StressTestModel {
  label: string;
  uid: string;
  children: StressTestModel[];

  constructor(depth: number = 0) {
    this.label = faker.animal.petName();
    this.uid = faker.string.uuid();
    if (depth < 3) {
      this.children = _.range(0, 50).map((a) => {
        return new StressTestModel(depth + 1);
      });
    }
  }
}
