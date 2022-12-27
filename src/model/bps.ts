import { IUser } from "./user";

export interface IBPSInfo {
    date: string;
    image: string;
    key: string;
    bpLink: string;
    likers?: Array<IUser['uid']>;
    dislikers?: Array<IUser['uid']>;
    name: string;
    ownerUid: IUser['uid'];
}

export interface IGamingBPS {
    date: string;
    image: string;
    key: string;
    name: string;
    video: string;
}

type YoutubeKey = {
    kind: string;
    videoId: string;
}

type YoutubeImageAsset = {
    url: string,
    width: number,
    height: number,
}

type YoutubeThumbnail = {
    default: YoutubeImageAsset,
    high: YoutubeImageAsset,
    medium: YoutubeImageAsset,
}

type YoutubeSnipper = {
    channelId: string,
    channelTitle: string,
    description: string,
    liveBroadcastContent: string,
    publishTime: string,
    publishedAt: string,
    thumbnails: YoutubeThumbnail,
    title: string,
}

export interface IYoutubeVideo {
    etag: string;
    id: YoutubeKey;
    kind: string;
    snippet?: YoutubeSnipper;
}
