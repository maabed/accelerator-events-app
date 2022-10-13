import { v4 as uuidV4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { AbstractService } from './abstract';

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export class EventService extends AbstractService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async generate({ email, page, size }) {
    try {
      let user = await this.repos.User.findMaybeOne({ email });
      if (!user) {
        await this.repos.User.query().insert({
          id: uuidV4(),
          email,
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          username: faker.internet.userName(),
          createdAt: new Date().toISOString(),
        });

        await this.repos.Calender.query().insert({
          id: uuidV4(),
          owner: user.id,
          name: `${email} calender`,
        });

        user = await this.repos.User.findMaybeOne({ email });
      }

      const events = [];
      for (let i = 0; i < size; i++) {
        const start = new Date(Date.now() + randomNumber(3, 9)).getTime();
        const event = {
          id: uuidV4(),
          start,
          end: start + 1.8e6, // start timestamp + 30 mins
          calId: user?.calender?.id,
          createdBy: user?.id,
          title: `${user.username} event ${randomNumber(1, 100)}`,
        };

        events.push(event);
      }

      return {
        data: events,
        size,
        totalPages: 5000 / size,
      };
    } catch (error) {
      this.log.error(error, 'Falied to generate events');
      throw this.errors.internal(error.message);
    }
  }
}
