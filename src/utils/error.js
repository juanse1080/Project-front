import { history } from 'helpers';

export default function error({ response }) {
  if (response && response.status) {
    switch (response.status) {
      case 404:
        history.push('/not-found');
        break;
  
      case 401:
        history.goBack();
        break;
  
      case 403:
        history.goBack();
        break;
  
      default:
        break;
    }
  }
}
