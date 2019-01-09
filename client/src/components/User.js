import React from 'react';
import styled from 'styled-components';

const UserNode = styled.div`
    width: 25%;
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    text-align: center;
    margin-bottom: 100px;
    padding: 15px;

    span {
        font-weight: bold;
    }
`;

export default props => (
    <UserNode>
        <p><span>ID:</span> {props.data.id}</p>
        <p><span>Name:</span> {props.data.name}</p>
        <p><span>Bio:</span> {props.data.bio}</p>
    </UserNode>
);