import styled from "styled-components";
import {Card, ThemeType} from "grommet";

export const MainCard = styled(Card)`
`;

export const globalTheme: ThemeType = {
    global: {
        font: {
            family: 'RobotoRegular',
            size: '18px',
            height: '20px',
        },
        colors: {
            "brand": "#01a982",
        }
    },
}
