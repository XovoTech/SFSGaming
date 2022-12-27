import { moderateScale } from "react-native-size-matters";

export default {
    type:'Dark',
    color:{
        primary: "#FFA000",
        secondary: "#5646C3",
        success: "#3FB64B",
        warn: "#FDC731",
        error: "#D62020",
        spider: "#FFFFFF",
        white: "#ffffff",
        black: "#000000",//change
        gray1: "#E1E1E1",
        gray2: "#647680",
        gray3: "#94A0A7",
        grayBackground1: "#2C2C2E",
        grayBackground2: "#383839",
        grayBackground3: "#242526",//change
        grayBackground4: "#383839",
        border: "#383839",//change
        divider: "#383839",//change
        icon1: "#778089",
        icon2: "#A0ACB3",
        icon3: "#ffffff",
        icon4: "#808191",
        iconBackground: "#313337",
        placeholderColor:'#98A6AD',
    },
    fontFamily: {
        bold: "FiraMono-Bold",
        regular: "FiraMono-Regular",
        medium: "FiraMono-Medium",
    },
    fontSize:{
        h1: moderateScale(34),
        h2: moderateScale(24),
        h3: moderateScale(17),
        h4: moderateScale(17),
        h5: moderateScale(15),
        h6: moderateScale(12),
        body: moderateScale(14),
        tabLabel: moderateScale(13),
        caption: moderateScale(12),
    },
    spacingFactor: moderateScale(8),
    get h1() {
        return {
            color: this.color.spider,
            fontFamily: this.fontFamily.bold,
            fontSize: this.fontSize.h1,
        }
    },
    get h2() {
        return {
            color: this.color.gray1,
        }
    },
    get body () {
        return {
            color: this.color.gray1,
        }
    },
    get caption() {
        return {
            color: this.color.gray2,
        }
    },
    get placeholder() {
        return {
            color: this.color.gray3,
        }
    },
    get background() {
        return {
            color: this.color.black,
        }
    },
};
