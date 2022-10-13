import S from 'fluent-json-schema';

function strictSchema() {
  return S.object().additionalProperties(false);
}


const attendees = strictSchema()
  .prop('email', S.string().format(S.FORMATS.EMAIL))
  .prop('status', S.string());


const event = strictSchema()
  .prop('id', S.string().format(S.FORMATS.UUID))
  .prop('createdBy', S.string().format(S.FORMATS.UUID))
  .prop('calId', S.string().format(S.FORMATS.UUID))
  .prop('title', S.string())
  .prop('start', S.string())
  .prop('end', S.string())
  .prop('duration', S.integer())
  .prop('alarm', S.boolean().default(true))
  .prop('url', S.string())
  .prop('attendees', S.anyOf([S.array().items(attendees), S.null()]));

const eventParams = strictSchema()
  .prop('email', S.string().format(S.FORMATS.EMAIL).required())
  .prop('page', S.integer().default(1))
  .prop('size', S.integer().default(5000))


const eventQuery = strictSchema()
  .prop('page', S.integer().default(1))
  .prop('size', S.integer().default(5000));

const listEventsResult = strictSchema()
  .prop('data', S.array().items(event))
  .prop('size', S.integer())
  .prop('totalPages', S.integer())

export default {
  listEvents: {
    params: eventParams,
    querystring: eventQuery,
    response: {
      200: listEventsResult,
    },
  },
};
