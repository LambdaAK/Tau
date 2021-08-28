export default async function getAccessToken(clientID: string): string {
    let authURL = `https://accounts.spotify.com/en/authorize?${clientID}&response_type=code&redirect_url=http:%2F%2F127.0.0.1:5500Findex.html&show_dialog=true&scope=user-read-private%20user-read-email%20user-modify-playback-state%20user-read-playback-position%20user-library-read%20streaming%user-read-playback-state%20user-read-recently-played%20playlist-read-private`
    console.log(authURL)



}