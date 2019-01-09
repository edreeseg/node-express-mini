import React from 'react';
import User from './User';
import styled from 'styled-components';

const List = styled.div`
    width: 80%;
    margin: 20px auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;

export default props => (
    <List>
        {props.users.map(x => <User key={x.id} data={x} />)}
    </List>
);