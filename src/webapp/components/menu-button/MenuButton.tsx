import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import { memo, useState, MouseEvent } from "react";
import styled from "styled-components";

export type Item = {
    label: string;
    id: string;
};

type Props = {
    label: string;
    items: Item[];
    onItemSelected: (id: string) => void;
};

export const MenuButton: React.FC<Props> = memo(({ label, items, onItemSelected }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const onOpenMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (item: Item) => {
        onItemSelected(item.id);
    };

    return (
        <Container>
            <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={onOpenMenu}
                endIcon={anchorEl ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            >
                {label}
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {items.map(item => (
                    <MenuItem key={item.id} onClick={handleClose}>
                        <Button variant="text" color="primary" onClick={() => handleClick(item)}>
                            {item.label}
                        </Button>
                    </MenuItem>
                ))}
            </Menu>
        </Container>
    );
});

const Container = styled.div`
    margin-inline-start: 1rem;
`;
