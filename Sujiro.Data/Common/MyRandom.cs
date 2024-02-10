namespace Sujiro.Data.Common
{
    public static class MyRandom
    {
        private static Random random = new Random();

        public static int Next()
        {
            if (random == null) random = new Random();
            return random.Next();
        }

        public static int Next(int maxValue)
        {
            if (random == null) random = new Random();
            return random.Next(maxValue);
        }

        public static int Next(int minValue, int maxValue)
        {
            if (random == null) random = new Random();
            return random.Next(minValue, maxValue);
        }
        public static long NextLong()
        {
            return random.NextInt64();
        }
        /**
         * JavascriptのMAX_SAFE_INTEGER以下の数字をランダムに出力します。
         */
        public static long NextSafeLong()
        {
            return random.NextInt64((1L << 53) - 1);
        }
    }
}
