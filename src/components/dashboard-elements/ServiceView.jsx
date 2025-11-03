import { Grid } from '@mui/material'
import { LineChart } from '@mui/x-charts'
import { LinechartService } from '../custom-elements/LinechartService'

export function ServiceView() {
    const topServiceDataset = [
        {
            time: '06:30',
            GoogleWeb: { value: 2, max: 5, total: 36 },
            CloudflareCDN: { value: 1, max: 6, total: 38 },
            AmazonAWS: { value: 0, max: 3, total: 15 },
            FacebookMeta: { value: 1, max: 3, total: 15 },
            MicrosoftTeams: { value: 0, max: 2, total: 9 },
            NetflixStreaming: { value: 1, max: 5, total: 31 },
            DropboxStorage: { value: 0, max: 2, total: 9 },
        },
        {
            time: '06:45',
            GoogleWeb: { value: 2, max: 5, total: 36 },
            CloudflareCDN: { value: 4, max: 6, total: 38 },
            AmazonAWS: { value: 2, max: 3, total: 15 },
            FacebookMeta: { value: 1, max: 3, total: 15 },
            MicrosoftTeams: { value: 1, max: 2, total: 9 },
            NetflixStreaming: { value: 4, max: 5, total: 31 },
            DropboxStorage: { value: 1, max: 2, total: 9 },
        },
        {
            time: '07:00',
            GoogleWeb: { value: 4, max: 5, total: 36 },
            CloudflareCDN: { value: 6, max: 6, total: 38 },
            AmazonAWS: { value: 2, max: 3, total: 15 },
            FacebookMeta: { value: 2, max: 3, total: 15 },
            MicrosoftTeams: { value: 2, max: 2, total: 9 },
            NetflixStreaming: { value: 4, max: 5, total: 31 },
            DropboxStorage: { value: 2, max: 2, total: 9 },
        },
        {
            time: '07:15',
            GoogleWeb: { value: 2, max: 5, total: 36 },
            CloudflareCDN: { value: 3, max: 6, total: 38 },
            AmazonAWS: { value: 1, max: 3, total: 15 },
            FacebookMeta: { value: 1, max: 3, total: 15 },
            MicrosoftTeams: { value: 1, max: 2, total: 9 },
            NetflixStreaming: { value: 2, max: 5, total: 31 },
            DropboxStorage: { value: 1, max: 2, total: 9 },
        },
        {
            time: '07:30',
            GoogleWeb: { value: 3, max: 5, total: 36 },
            CloudflareCDN: { value: 4, max: 6, total: 38 },
            AmazonAWS: { value: 1, max: 3, total: 15 },
            FacebookMeta: { value: 2, max: 3, total: 15 },
            MicrosoftTeams: { value: 1, max: 2, total: 9 },
            NetflixStreaming: { value: 3, max: 5, total: 31 },
            DropboxStorage: { value: 1, max: 2, total: 9 },
        },
        {
            time: '07:45',
            GoogleWeb: { value: 5, max: 5, total: 36 },
            CloudflareCDN: { value: 6, max: 6, total: 38 },
            AmazonAWS: { value: 3, max: 3, total: 15 },
            FacebookMeta: { value: 2, max: 3, total: 15 },
            MicrosoftTeams: { value: 2, max: 2, total: 9 },
            NetflixStreaming: { value: 4, max: 5, total: 31 },
            DropboxStorage: { value: 2, max: 2, total: 9 },
        },
        {
            time: '08:00',
            GoogleWeb: { value: 4, max: 5, total: 36 },
            CloudflareCDN: { value: 5, max: 6, total: 38 },
            AmazonAWS: { value: 2, max: 3, total: 15 },
            FacebookMeta: { value: 1, max: 3, total: 15 },
            MicrosoftTeams: { value: 1, max: 2, total: 9 },
            NetflixStreaming: { value: 3, max: 5, total: 31 },
            DropboxStorage: { value: 1, max: 2, total: 9 },
        },
    ]

    const medianServiceDataset = [
        {
            time: '06:30',
            ZoomMeeting: { value: 2, max: 3, total: 13 },
            SpotifyMusic: { value: 3, max: 4, total: 21 },
            GitHubRepo: { value: 1, max: 3, total: 12 },
            TwitterFeed: { value: 2, max: 3, total: 13 },
            SlackChat: { value: 1, max: 2, total: 8 },
            TrelloBoard: { value: 0, max: 2, total: 5 },
            WhatsAppCall: { value: 1, max: 2, total: 7 },
        },
        {
            time: '06:45',
            ZoomMeeting: { value: 3, max: 3, total: 13 },
            SpotifyMusic: { value: 2, max: 4, total: 21 },
            GitHubRepo: { value: 2, max: 3, total: 12 },
            TwitterFeed: { value: 1, max: 3, total: 13 },
            SlackChat: { value: 2, max: 2, total: 8 },
            TrelloBoard: { value: 1, max: 2, total: 5 },
            WhatsAppCall: { value: 0, max: 2, total: 7 },
        },
        {
            time: '07:00',
            ZoomMeeting: { value: 1, max: 3, total: 13 },
            SpotifyMusic: { value: 4, max: 4, total: 21 },
            GitHubRepo: { value: 1, max: 3, total: 12 },
            TwitterFeed: { value: 3, max: 3, total: 13 },
            SlackChat: { value: 1, max: 2, total: 8 },
            TrelloBoard: { value: 2, max: 2, total: 5 },
            WhatsAppCall: { value: 1, max: 2, total: 7 },
        },
        {
            time: '07:15',
            ZoomMeeting: { value: 2, max: 3, total: 13 },
            SpotifyMusic: { value: 3, max: 4, total: 21 },
            GitHubRepo: { value: 2, max: 3, total: 12 },
            TwitterFeed: { value: 2, max: 3, total: 13 },
            SlackChat: { value: 1, max: 2, total: 8 },
            TrelloBoard: { value: 1, max: 2, total: 5 },
            WhatsAppCall: { value: 2, max: 2, total: 7 },
        },
        {
            time: '07:30',
            ZoomMeeting: { value: 3, max: 3, total: 13 },
            SpotifyMusic: { value: 2, max: 4, total: 21 },
            GitHubRepo: { value: 3, max: 3, total: 12 },
            TwitterFeed: { value: 1, max: 3, total: 13 },
            SlackChat: { value: 2, max: 2, total: 8 },
            TrelloBoard: { value: 0, max: 2, total: 5 },
            WhatsAppCall: { value: 1, max: 2, total: 7 },
        },
        {
            time: '07:45',
            ZoomMeeting: { value: 1, max: 3, total: 13 },
            SpotifyMusic: { value: 3, max: 4, total: 21 },
            GitHubRepo: { value: 1, max: 3, total: 12 },
            TwitterFeed: { value: 2, max: 3, total: 13 },
            SlackChat: { value: 1, max: 2, total: 8 },
            TrelloBoard: { value: 1, max: 2, total: 5 },
            WhatsAppCall: { value: 2, max: 2, total: 7 },
        },
        {
            time: '08:00',
            ZoomMeeting: { value: 2, max: 3, total: 13 },
            SpotifyMusic: { value: 4, max: 4, total: 21 },
            GitHubRepo: { value: 2, max: 3, total: 12 },
            TwitterFeed: { value: 3, max: 3, total: 13 },
            SlackChat: { value: 2, max: 2, total: 8 },
            TrelloBoard: { value: 1, max: 2, total: 5 },
            WhatsAppCall: { value: 1, max: 2, total: 7 },
        },
    ]

    return (
        <Grid container spacing={2}>
            <Grid size={6} container direction="column" spacing={1}>
                <LinechartService title={'Top des services actifs'} dataFrom={topServiceDataset} />
            </Grid>

            <Grid size={6} container direction="column" spacing={1}>
                <LinechartService title={'Median des services actifs'} dataFrom={medianServiceDataset} />
            </Grid>
        </Grid>
    )
}
