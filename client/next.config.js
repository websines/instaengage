module.exports = {
    async redirects(){
      return[
        {
          source: '/',
          destination: '/login',
          permanent: true,
        }
      ]
    },
    images: {
      domains: ['scontent-ort2-1.cdninstagram.com', 'instagram.fccu3-1.fna.fbcdn.net'],
    },
    env:{
      API_URL: 'http://13.59.174.126:8080'
    }
}