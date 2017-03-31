import Relay from 'react-relay';
import App from './AppComponent';
import VcUser from '../User/VcUserContainer';

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
      }`
  }
});