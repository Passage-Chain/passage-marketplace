var httpConfig = {
  host: (process.env.NODE_ENV === 'production' ? '' : "http://localhost:3001"),
  api: "/core/api",
  version: "/v1",
  user: "/user",
  public: "/public",
  get login() {
    return this.host + this.api + this.version + "/login";
  },

  get register() {
    return this.host + this.api + this.version + "/register";
  },

  get facebookAuth() {
    return this.host + this.api + this.version + "/facebook-auth";
  },

  get facebookCallback() {
    return (
      this.host +
      this.api +
      this.version +
      this.user +
      "/facebook/callback?code"
    );
  },

  get whoami() {
    return this.host + this.api + this.version + this.user + "/whoami";
  },

  get friendsList() {
    return this.host + this.api + this.version + this.user + "/list-friend";
  },

  get requestFriendship() {
    return (
      this.host +
      this.api +
      this.version +
      this.user +
      "/request-for-friendship"
    );
  },

  get rejectionFriendship() {
    return (
      this.host +
      this.api +
      this.version +
      this.user +
      "/rejection-of-friendship"
    );
  },

  get addFriend() {
    return this.host + this.api + this.version + this.user + "/add-friend";
  },

  get updateUser() {
    return this.host + this.api + this.version + this.user + "/update-user";
  },

  get updatePrivacy() {
    return (
      this.host + this.api + this.version + this.user + "/update-user-privacy"
    );
  },

  get addReport() {
    return this.host + this.api + this.version + this.user + "/add-report";
  },

  searchUser(nickname, email) {
    return `${this.host}${this.api}${this.version}${this.user}/search-user?${
      nickname && email
        ? `nickname=${nickname}&email=${email}`
        : nickname && !email
        ? `nickname=${nickname}`
        : !nickname && email
        ? `email=${email}`
        : ""
    }`;
  },

  deleteFriend(friendId) {
    return (
      this.host +
      this.api +
      this.version +
      this.user +
      `/delete-friend/${friendId}`
    );
  },

  getAgoraTokenUrl(channelName, uid) {
    return `${this.host}${this.api}${this.version}${this.user}/get-agora-token?channelName=${channelName}` + (uid ? `&uid=${uid}` : '')
    ;
  },
  getNeonListItems(skip, take) {
    return (
      this.host +
      this.api +
      this.version +
      this.user +
      "/list-items?skip=" +
      skip +
      "&take=" +
      take
    );
  },
  get getGameInstanceUrl() {
    return `${this.host}${this.api}${this.version}${this.user}/get-game-instance-url`;
  },
  get getGameSessionToken() {
    return `${this.host}${this.api}${this.version}${this.user}/get-game-session-token`;
  },

  get sendFriendRequest() {
    return `${this.host}${this.api}${this.version}${this.user}/send-friend-request`;
  },

  get makeworldFavourite(){
    return this.host + this.api + this.version + this.user + "/make-world-favourite";
  },
  get getFriendList() {
    return `${this.host}${this.api}${this.version}${this.user}/list-friend`;
  },

  get cancelFriendRequest() {
    return `${this.host}${this.api}${this.version}${this.user}/cancel-friend-request`;
  },

  get removeFriend() {
    return `${this.host}${this.api}${this.version}${this.user}/delete-friend`;
  },

  get createGroup() {
    return `${this.host}${this.api}${this.version}${this.user}/create-group`;
  },

  get renameGroup() {
    return `${this.host}${this.api}${this.version}${this.user}/rename-group`;
  },

  get addMemberToGroup() {
    return `${this.host}${this.api}${this.version}${this.user}/add-members`;
  },

  get removeMemberFromGroup() {
    return `${this.host}${this.api}${this.version}${this.user}/remove_member`;
  },

  get muteGroup() {
    return `${this.host}${this.api}${this.version}${this.user}/mute-group`;
  },

  get unMuteGroup() {
    return `${this.host}${this.api}${this.version}${this.user}/unmute-group`;
  },

  get leaveGroup() {
    return `${this.host}${this.api}${this.version}${this.user}/leave-group`;
  },

  getPendingInvites(pageNo, limit) {
    return `${this.host}${this.api}${this.version}${this.user}/list-pending-requests?page=${pageNo}&limit=${limit}`;
  },

  get acceptFriendRequest() {
    return `${this.host}${this.api}${this.version}${this.user}/add-friend`;
  },

  get rejectFriendRequest() {
    return `${this.host}${this.api}${this.version}${this.user}/rejection-of-friendship`;
  },

  get getChatSecretKey() {
    return `${this.host}${this.api}${this.version}${this.user}/createToken`;
  },
  get uniqueUserName() {
    return this.host + this.api + this.version + "/isUsernameValid";
  },
  get uniqueEmail() {
    return this.host + this.api + this.version + "/isEmailValid";
  },
  get getUserSettingNotification() {
    return `${this.host}${this.api}${this.version}${this.user}/notificationSettingInfo`;
  },
  get updateUserSettingNotification() {
    return `${this.host}${this.api}${this.version}${this.user}/updateNotificationSettingInfo`;
  },

  get getUserDetails() {
    return `${this.host}${this.api}${this.version}${this.user}/userDetails`;
  },
  get updateUserDetails() {
    return `${this.host}${this.api}${this.version}${this.user}/updateUserDetails`;
  },
  get getUserPublicProfile() {
    return `${this.host}${this.api}${this.version}${this.user}/getUserPublicProfile`;
  },
  get updateUserPublicProfile() {
    return `${this.host}${this.api}${this.version}${this.user}/updateUserPublicProfile`;
  },
  get connectWallet() {
    return `${this.host}${this.api}${this.version}${this.user}/connectWallet`;
  },
  get userAudioVideoInfo(){
    return `${this.host}${this.api}${this.version}${this.user}/userAudioVideoInfo`;
  },
  get updateUserAudioVideoInfo(){
    return `${this.host}${this.api}${this.version}${this.user}/updateUserAudioVideoInfo`;
  },

  get getControlData () {
    return `${this.host}${this.api}${this.version}${this.user}/getUserControls`;
  },

  get updateControlData () {
    return `${this.host}${this.api}${this.version}${this.user}/editUserControls`;
  },

  getEventDetails(eventName) {
    return `${this.host}${this.api}${this.version}${this.user}/get-event?eventName=${eventName}`;
  },

  get sendPasswordRecovryEmail() {
    return this.host + this.api + this.version + "/getRecoveryCode";
  },
  get validateSecurityCode() {
    return this.host + this.api + this.version + "/validateSecurityCode";
  },
  get resetPassword() {
    return this.host + this.api + this.version + "/resetPassword";
  },
  editFeed(feedId) {
    return `${this.host}${this.api}${this.version}${this.user}/edit-feed/${feedId}`;
  },
  get createFeed() {
    return this.host + this.api + this.version + this.user + "/create-feed";
  },
  getUserFeed(page, limit) {
    return `${this.host}${this.api}${this.version}${this.user}/getUserFeed?page=${page}&limit=${limit}`
  },
  get getMyWorld() {
    return this.host + this.api + this.version + this.user + "/getMyWorld";
  },
  get getSimilarGames() {
    return `${this.host}${this.api}${this.version}${this.user}/similargames`;
  },
  getWorlds() {
    return `${this.host}${this.api}${this.version}${this.user}/get-worlds`;
  },

  get addToFavorite() {
    return `${this.host}${this.api}${this.version}${this.user}/make-world-favourite`;
  },

  getFavorite() {
    return `${this.host}${this.api}${this.version}${this.user}/get-favourite-world`;
  },

  get removeFavorite() {
    return `${this.host}${this.api}${this.version}${this.user}/remove-favourite-world`;
  },

  get getFavouriteworld(){
    return this.host + this.api + this.version  + this.user + "/get-favourite-world";
  },
  get getSimillarWorld(){
    return this.host + this.api + this.version  + this.user + "/get-similar-worlds";
  },
  get getMostPlayedGame(){
    return this.host + this.api + this.version  + this.user + "/getMostPlayedGame";
  },
 getMyFeeds(userId, page, limit) {
    return `${this.host}${this.api}${this.version}${this.user}/getMyFeeds?userId=${userId}&limit=${limit}&page=${page}`;
  },
  getworldbyid(worldId) {
     return `${this.host}${this.api}${this.version}${this.user}/get-world-by-id/${ worldId }`;
  },
  getWorldFeed(worldId) {
    return `${this.host}${this.api}${this.version}${this.user}/getWorldFeed?worldId=${worldId}`;
  },
  get removeWorldFromFav(){
    return this.host + this.api + this.version  + this.user + "/remove-favourite-world";
  },
  likeSocialFeed(feedId){
    return `${this.host}${this.api}${this.version}${this.user}/likeSocialFeed?feedId=${feedId}`;
  },
  deleteSocialFeed(feedId){
    return `${this.host}${this.api}${this.version}${this.user}/deleteSocialFeed?feedId=${feedId}`;
  },
  get getSentInvites() {
    return `${this.host}${this.api}${this.version}${this.user}/list-sent-requests`;
  },
  get getWalletList() {
    return `${this.host}${this.api}${this.version}${this.user}/listAllWallets`;
  },
  allUserBadges(userId) {
    return `${this.host}${this.api}${this.version}${this.user}/allUserBadges?userId=${userId}`;
  },
  get followUser(){
    return `${this.host}${this.api}${this.version}${this.user}/followUser`;
  },
  get unFollowUser(){
    return `${this.host}${this.api}${this.version}${this.user}/unfollowUser`;
  },
  checkForFollowing(targetUserId){
    return `${this.host}${this.api}${this.version}${this.user}/checkForFollowing?targetUserId=${targetUserId}`;
  },
  followCount(targetUserId){
    return `${this.host}${this.api}${this.version}${this.user}/followCount?targetUserId=${targetUserId}`;
  },
  get getRefreshToken(){
    return `${this.host}${this.api}${this.version}/refreshToken`;
  },
  get directory() {
    let host = this.host; // possibly empty string
    if(/^http/.test(host)) {
        host = host.replace(/^http(.*)$/, 'ws$1');
    }
    return `${host}${this.api}${this.version}${this.user}/api/v1/directory/frontend`
  },

  get getPromotedGames() {
    return `${this.host}${this.api}${this.version}${this.public}/getPromotedGame`;
  },

  get getWorldsByFilter() {
    return `${this.host}${this.api}${this.version}/get-worlds-by-filter`;
  },

  get inviteFriendToGame() {
    return `${this.host}${this.api}${this.version}${this.user}/inviteFriendToGame`;
  },

  getFriendListForGameInvitation(gameId) {
    return `${this.host}${this.api}${this.version}${this.user}/getFriendsListForInvitation/${gameId}`;
  },
  get createdNotification() {
    return `${this.host}${this.api}${this.version}${this.user}/createSampleNotification`
  },
  get getNotifications() {
    return `${this.host}${this.api}${this.version}${this.user}/getNotifications`;
  },
  markAsReadByNotifId(id) {
    return `${this.host}${this.api}${this.version}${this.user}/markAsReadByNotifId?notificationId=${id}`;
  },
  get markAllAsRead() {
    return `${this.host}${this.api}${this.version}${this.user}/markAllAsRead`;
  },
  get getAllWalletList() {
    return `${this.host}${this.api}${this.version}${this.user}/listAllWallets`;
  },
  get makeWalletActive(){
    return `${this.host}${this.api}${this.version}${this.user}/makeWalletActive`;
  },
  get addWallet(){
    return `${this.host}${this.api}${this.version}${this.user}/addWallet`;
  },
  get deleteWallet(){
    return `${this.host}${this.api}${this.version}${this.user}/deleteWallet`;
  },
  getGlobalSearch(keyword, category) {
    return `${this.host}${this.api}${this.version}${this.user}/globalSearch?keyword=${keyword}&category=${category}`;
  },
  get getWebsocketToken(){
    return `${this.host}${this.api}${this.version}${this.user}/get-ws-token`;
  }
};


export default httpConfig;
