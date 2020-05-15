import React from 'react';
import { Card, Heading } from '@8base/boost';

import { OrderProducts } from './OrderProducts';

const OrderView = ({ computedMatch }) => {

  return (
    <Card padding="md" stretch>
      <Card.Header>
        <Heading type="h4" text="Order view" />
      </Card.Header>

      <Card.Body padding="none" stretch scrollable>
        <OrderProducts id={computedMatch.params.id} />
      </Card.Body>
    </Card>
  );
};

export { OrderView };
