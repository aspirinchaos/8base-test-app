import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { AppProvider } from '@8base/react-sdk';
import { Auth, AUTH_STRATEGIES } from '@8base/auth';
import { BoostProvider, AsyncContent } from '@8base/boost';
import { ToastContainer, toast } from 'react-toastify';

import { ProtectedRoute } from 'shared/components';
import { TOAST_SUCCESS_MESSAGE } from 'shared/constants';

import { MainPlate, ContentPlate, Nav } from './components';
import { Auth as AuthCallback } from './routes/auth';
import { Clients } from './routes/clients';
import { ClientView } from './routes/client-view';
import { Orders } from './routes/orders';
import { OrderView } from './routes/order-view';
import { Products } from './routes/products';

const {
  REACT_APP_8BASE_API_ENDPOINT,
  REACT_APP_8BASE_API_TOKEN,
} = process.env;

const authClient = Auth.createClient({
  strategy: AUTH_STRATEGIES.API_TOKEN,
  subscribable: true,
}, {
  apiToken: REACT_APP_8BASE_API_TOKEN,
  redirectUri: `${window.location.origin}/auth/callback`,
  logoutRedirectUri: `${window.location.origin}/auth`,
});

class Application extends React.PureComponent {
  renderContent = ({ loading }) => (
    <AsyncContent loading={loading} stretch>
      <Switch>
        <Route path="/auth" component={AuthCallback} />
        <Route>
          <MainPlate>
            <Nav.Plate color="BLUE">
              <Nav.Item icon="Customers" to="/clients" label="Clients" />
              <Nav.Item icon="Contract" to="/orders" label="Orders" />
              <Nav.Item icon="Screens" to="/products" label="Products" />
            </Nav.Plate>
            <ContentPlate>
              <Switch>
                <ProtectedRoute exact path="/clients" component={Clients} />
                <ProtectedRoute path="/client/:id" component={ClientView} />
                <ProtectedRoute exact path="/orders" component={Orders} />
                <ProtectedRoute path="/order/:id" component={OrderView} />
                <ProtectedRoute exact path="/products" component={Products} />
                <Redirect to="/clients" />
              </Switch>
            </ContentPlate>
          </MainPlate>
        </Route>
      </Switch>
    </AsyncContent>
  );

  onRequestSuccess = ({ operation }) => {
    const message = operation.getContext()[TOAST_SUCCESS_MESSAGE];

    if (message) {
      toast.success(message);
    }
  };

  onRequestError = ({ graphQLErrors }) => {
    const hasGraphQLErrors = Array.isArray(graphQLErrors) && graphQLErrors.length > 0;

    if (hasGraphQLErrors) {
      graphQLErrors.forEach(error => {
        toast.error(error.message);
      });
    }
  };

  render() {
    return (
      <BrowserRouter>
        <BoostProvider>
          <AppProvider
            uri={REACT_APP_8BASE_API_ENDPOINT}
            authClient={authClient}
            onRequestSuccess={this.onRequestSuccess}
            onRequestError={this.onRequestError}
          >
            {this.renderContent}
          </AppProvider>
          <ToastContainer position={toast.POSITION.BOTTOM_LEFT} />
        </BoostProvider>
      </BrowserRouter>
    );
  }
}

export { Application };
