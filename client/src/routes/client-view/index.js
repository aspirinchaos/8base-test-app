import React from 'react';
import { Card, Heading } from '@8base/boost';

import { ClientOrders } from './ClientOrders';

const ClientView = ({ computedMatch }) => {
  return (
    <Card padding="md" stretch>
      <Card.Header>
        <Heading type="h4" text="Client view" />
      </Card.Header>

      <Card.Body padding="none" stretch scrollable>
        <ClientOrders id={computedMatch.params.id} />
      </Card.Body>
    </Card>
  );
};

export { ClientView };
