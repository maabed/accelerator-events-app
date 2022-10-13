import axios from 'axios';
import { faker } from '@faker-js/faker';
import { v4 as uuidV4 } from 'uuid';
import { User, Event, Calender } from './repos';

export const eventConsumer = async () => {
  console.log('Start consuming events for 5 users ...');

  for (let i = 0; i < 5; i++) {
    const email = faker.internet.email();
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const username = faker.internet.userName();

    await User.query().insert({
      id: uuidV4(),
      firstName,
      lastName,
      username,
      email,
      createdAt: new Date().toISOString(),
    }).then(async user => {
      try {
        await Calender.query().insert({
          id: uuidV4(),
          owner: user.id,
          name: `${email} calender`,
        }) 
        const { data } = await axios.get(`http://localhost:9000/api/v1/events/${encodeURI(user.email)}`);
        await Event.query().insert(data?.data);
      } catch (error) {
        console.log(error);
      }
    }).catch(err => {
      console.log('error while inserting batch of events, Error: %j.', err);
    });
  }

  console.log('Done...');
};
