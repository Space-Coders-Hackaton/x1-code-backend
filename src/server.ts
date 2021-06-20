import { SERVER_PORT, SERVER_URL } from '@config/env';
import { started } from '@utils/started';
import { app } from '.';
import './queues/correction';

app.listen(SERVER_PORT, () => started(SERVER_PORT, SERVER_URL));
