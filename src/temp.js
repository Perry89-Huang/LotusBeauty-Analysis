const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($table_id: Int!, $status: String!, $total_amount: numeric!, $order_items: [order_items_insert_input!]!) {
    insert_orders_one(object: {
      table_id: $table_id,
      status: $status,
      total_amount: $total_amount,
      order_items: {
        data: $order_items
      }
    }) {
      id
      table_id
      status
      total_amount
      created_at
      order_items {
        id
        dish_id
        quantity
        unit_price
        subtotal
        dish_items_text
      }
    }
  }
`;