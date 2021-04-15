import { Paper } from '@material-ui/core';

export default function Product(props) {
    const { name, price, is_sold_per_unit } = props;

    return (
        <Paper>
            <p>{name}</p>
            <p>£{price}</p>
            <p>{String(is_sold_per_unit)}</p>
        </Paper>
    )
}