import React from 'react';
import { Card, Heading } from '@8base/boost';

import { OrderCreateDialog } from './OrderCreateDialog';
import { OrderDeleteDialog } from './OrderDeleteDialog';
import { OrderTable } from './OrderTable';

const Orders = () => (
  <Card padding="md" stretch>
    <Card.Header>
      <Heading type="h4" text="Orders" />
    </Card.Header>

    <OrderCreateDialog />
    <OrderDeleteDialog />

    <Card.Body padding="none" stretch scrollable>
      <OrderTable />
    </Card.Body>
  </Card>
);

export { Orders };
