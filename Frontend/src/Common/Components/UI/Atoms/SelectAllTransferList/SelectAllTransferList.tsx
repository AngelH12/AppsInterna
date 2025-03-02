import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useTransferList } from 'hooks/useTransferList';

interface TransferListProps<T> {
  titleLeft: string;
  titleRight: string;
  itemsLeft: T[];
  itemsRight: T[];
  renderItem: (item: T) => string;
}

export function TransferList<T>({ titleLeft, titleRight, itemsLeft, itemsRight, renderItem }: TransferListProps<T>) {
  const {
    left,
    right,
    checked,
    handleToggle,
    handleToggleAll,
    moveCheckedRight,
    moveCheckedLeft,
    leftChecked,
    rightChecked,
  } = useTransferList(itemsLeft, itemsRight);

  const customList = (title: string, items: readonly T[]) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={() => handleToggleAll(items)}
            checked={items.length > 0 && checked.filter((c) => items.includes(c)).length === items.length}
            indeterminate={checked.filter((c) => items.includes(c)).length > 0 && checked.filter((c) => items.includes(c)).length !== items.length}
            disabled={items.length === 0}
          />
        }
        title={title}
        subheader={`${checked.filter((c) => items.includes(c)).length}/${items.length} seleccionados`}
      />
      <Divider />
      <List sx={{ width: 300, height: 230, bgcolor: 'background.paper', overflow: 'auto' }} dense component="div">
        {items.map((item) => {
          return (
            <ListItemButton key={renderItem(item)} onClick={() => handleToggle(item)}>
              <ListItemIcon>
                <Checkbox checked={checked.includes(item)} tabIndex={-1} disableRipple />
              </ListItemIcon>
              <ListItemText primary={renderItem(item)} />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>{customList(titleLeft, left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={moveCheckedRight} disabled={leftChecked.length === 0}>
            &gt;
          </Button>
          <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={moveCheckedLeft} disabled={rightChecked.length === 0}>
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList(titleRight, right)}</Grid>
    </Grid>
  );
}
